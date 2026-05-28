import { Meteor } from 'meteor/meteor';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';
import { getDefaultStore } from 'jotai';

import { privateKeyAtom } from '../state';
import { generateKeyPair, encryptPrivateKey, decryptPrivateKey } from './crypto';

const LOCAL_KEY = 'e2ee_pk';

function saveKeyLocally(privateKey: Uint8Array) {
  localStorage.setItem(LOCAL_KEY, encodeBase64(privateKey));
}

function verifyPassword(password: string): Promise<boolean> {
  const user = Meteor.user();
  const identifier = user?.username || user?.emails?.[0]?.address;
  if (!identifier) return Promise.resolve(false);
  return new Promise((resolve) => {
    Meteor.loginWithPassword(identifier, password, (err) => resolve(!err));
  });
}

export function clearEncryptionKey() {
  localStorage.removeItem(LOCAL_KEY);
  getDefaultStore().set(privateKeyAtom, null);
}

// Called on every app load — restores the key from localStorage if available.
export function restoreKeyFromSession() {
  const stored = localStorage.getItem(LOCAL_KEY);
  if (!stored) return;
  try {
    const privateKey = decodeBase64(stored);
    getDefaultStore().set(privateKeyAtom, privateKey);
  } catch {
    localStorage.removeItem(LOCAL_KEY);
  }
}

// Called immediately after login while the plaintext password is in scope,
// or manually when restoring the key on a new host without re-logging in.
export async function setupEncryption(
  _userId: string,
  password: string
): Promise<'ok' | 'wrong-password' | 'error'> {
  try {
    // Verify the password before touching any keys
    const isValid = await verifyPassword(password);
    if (!isValid) return 'wrong-password';

    const backup = await Meteor.callAsync('getEncryptionKeyBackup');

    let privateKey: Uint8Array | null = null;

    if (backup?.encryptedPrivateKey && backup?.keySalt) {
      privateKey = await decryptPrivateKey(
        backup.encryptedPrivateKey,
        backup.keySalt,
        password
      );
      if (!privateKey) {
        return 'wrong-password';
      }
    } else {
      const keyPair = generateKeyPair();
      const { encryptedPrivateKey, salt } = await encryptPrivateKey(
        keyPair.secretKey,
        password
      );
      await Meteor.callAsync('saveEncryptionKeys', {
        publicKey: encodeBase64(keyPair.publicKey),
        encryptedPrivateKey,
        keySalt: salt,
      });
      privateKey = keyPair.secretKey;
    }

    saveKeyLocally(privateKey);
    getDefaultStore().set(privateKeyAtom, privateKey);
    return 'ok';
  } catch (error) {
    console.error('[E2EE] setupEncryption failed:', error);
    return 'error';
  }
}
