import { Meteor } from 'meteor/meteor';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';
import { getDefaultStore } from 'jotai';

import { privateKeyAtom } from '../state';
import { generateKeyPair, encryptPrivateKey, decryptPrivateKey } from './crypto';

const LOCAL_KEY = 'e2ee_pk';

function saveKeyLocally(privateKey: Uint8Array) {
  localStorage.setItem(LOCAL_KEY, encodeBase64(privateKey));
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

// Called immediately after login while the plaintext password is in scope.
export async function setupEncryption(_userId: string, password: string) {
  try {
    const backup = await Meteor.callAsync('getEncryptionKeyBackup');

    let privateKey: Uint8Array | null = null;

    if (backup?.encryptedPrivateKey && backup?.keySalt) {
      privateKey = await decryptPrivateKey(
        backup.encryptedPrivateKey,
        backup.keySalt,
        password
      );
      if (!privateKey) {
        console.error('[E2EE] Failed to decrypt private key');
        return;
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
  } catch (error) {
    console.error('[E2EE] setupEncryption failed:', error);
  }
}
