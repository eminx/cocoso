import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

// encodeUTF8: Uint8Array → string  (bytes to text)
// decodeUTF8: string → Uint8Array  (text to bytes)
// encodeBase64: Uint8Array → string
// decodeBase64: string → Uint8Array

// ── Key derivation ────────────────────────────────────────────────────────────

async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const passwordBytes = new TextEncoder().encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 200_000 },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

// ── Key pair generation ───────────────────────────────────────────────────────

export function generateKeyPair() {
  return nacl.box.keyPair();
}

// ── Private key backup ────────────────────────────────────────────────────────

export async function encryptPrivateKey(
  privateKey: Uint8Array,
  password: string
): Promise<{ encryptedPrivateKey: string; salt: string }> {
  const salt = nacl.randomBytes(16);
  const derivedKey = await deriveKey(password, salt);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const box = nacl.secretbox(privateKey, nonce, derivedKey);

  const combined = new Uint8Array(nonce.length + box.length);
  combined.set(nonce);
  combined.set(box, nonce.length);

  return {
    encryptedPrivateKey: encodeBase64(combined),
    salt: encodeBase64(salt),
  };
}

export async function decryptPrivateKey(
  encryptedPrivateKey: string,
  salt: string,
  password: string
): Promise<Uint8Array | null> {
  const combined = decodeBase64(encryptedPrivateKey);
  const saltBytes = decodeBase64(salt);
  const derivedKey = await deriveKey(password, saltBytes);

  const nonce = combined.slice(0, nacl.secretbox.nonceLength);
  const box = combined.slice(nacl.secretbox.nonceLength);

  return nacl.secretbox.open(box, nonce, derivedKey);
}

// ── Message encryption ────────────────────────────────────────────────────────

export function encryptMessage(
  plaintext: string,
  recipientPublicKey: string,
  senderPublicKey: string,
  senderPrivateKey: Uint8Array
): { recipientCiphertext: string; senderCiphertext: string } {
  const message = decodeUTF8(plaintext);          // string → Uint8Array
  const recipientPubKey = decodeBase64(recipientPublicKey);
  const senderPubKey = decodeBase64(senderPublicKey);

  const nonce1 = nacl.randomBytes(nacl.box.nonceLength);
  const box1 = nacl.box(message, nonce1, recipientPubKey, senderPrivateKey);
  const combined1 = new Uint8Array(nonce1.length + box1.length);
  combined1.set(nonce1);
  combined1.set(box1, nonce1.length);

  const nonce2 = nacl.randomBytes(nacl.box.nonceLength);
  const box2 = nacl.box(message, nonce2, senderPubKey, senderPrivateKey);
  const combined2 = new Uint8Array(nonce2.length + box2.length);
  combined2.set(nonce2);
  combined2.set(box2, nonce2.length);

  return {
    recipientCiphertext: encodeBase64(combined1),
    senderCiphertext: encodeBase64(combined2),
  };
}

export function decryptMessage(
  ciphertext: string,
  senderPublicKey: string,
  myPrivateKey: Uint8Array
): string | null {
  const combined = decodeBase64(ciphertext);
  const senderPubKey = decodeBase64(senderPublicKey);

  const nonce = combined.slice(0, nacl.box.nonceLength);
  const box = combined.slice(nacl.box.nonceLength);

  const plaintext = nacl.box.open(box, nonce, senderPubKey, myPrivateKey);
  if (!plaintext) return null;
  return encodeUTF8(plaintext);                   // Uint8Array → string
}
