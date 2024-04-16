import heic2any from 'heic2any';

export default async function convertHeic(base64Data) {
  const uint8Array = convertBase64ToUInt8Array(base64Data);

  const blob = new Blob([uint8Array], { type: 'image/heic' });

  let jpegBlob = await heic2any({
    blob: blob,
    toType: 'image/jpeg',
    quality: 1,
  });

  // get single png blob if heic2any returns an array
  if (Array.isArray(jpegBlob)) {
    jpegBlob = jpegBlob[0];
  }

  // return base 64 data
  return extractBase64FromBlob(jpegBlob);
}

export function convertBase64ToUInt8Array(base64) {
  // this is basically a node buffer
  // can get an array buffer with bytes.buffer
  // remove data:image/jpeg;base64, from base64 string if present
  if (base64.startsWith('data:')) {
    base64 = base64.split(',')[1];
  }

  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  return bytes;
}

export async function extractBase64FromBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}
