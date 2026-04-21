import { Meteor } from 'meteor/meteor';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';
import { getDefaultStore } from 'jotai';

import { privateKeyAtom } from '../state';
import { generateKeyPair, encryptPrivateKey, decryptPrivateKey } from './crypto';

const SESSION_KEY = 'e2ee_pk';

function saveKeyToSession(privateKey: Uint8Array) {
  sessionStorage.setItem(SESSION_KEY, encodeBase64(privateKey));
}

// Called on every app load — restores the key from sessionStorage if available.
// sessionStorage is cleared when the tab/browser is closed.
export function restoreKeyFromSession() {
  const stored = sessionStorage.getItem(SESSION_KEY);
  console.log('[E2EE] restoreKeyFromSession — stored key present:', Boolean(stored));
  if (!stored) return;
  try {
    const privateKey = decodeBase64(stored);
    getDefaultStore().set(privateKeyAtom, privateKey);
    console.log('[E2EE] Key restored from sessionStorage ✓');
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
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

    saveKeyToSession(privateKey);
    getDefaultStore().set(privateKeyAtom, privateKey);
  } catch (error) {
    console.error('[E2EE] setupEncryption failed:', error);
  }
}
