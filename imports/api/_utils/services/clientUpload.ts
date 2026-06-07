import { Meteor } from 'meteor/meteor';
import Resizer from 'react-image-file-resizer';
import { ImageContext } from './imageProcessor';
import { ImageVariantUrls } from './imageProcessor';

// Re-export the type so consumers can import from here
export type { ImageContext, ImageVariantUrls };

export interface UploadResult {
  _id: string;
  variants: ImageVariantUrls;
}

/**
 * Convert a data URL to a File object
 */
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Read a File as a base64 string (without the data: prefix)
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      const result = reader.result as string;
      // Strip the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    });
    reader.addEventListener('error', () => reject(reader.error));
  });
}

/**
 * Client-side resize before upload.
 * Skips if the file is already small enough.
 */
export async function resizeBeforeUpload(
  file: File | undefined,
  maxWidth = 1600,
  maxHeight = 1600
): Promise<File | undefined> {
  if (!file) return undefined;

  // If the file is already small, skip resizing
  if (file.size < 400000) {
    return file;
  }

  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG',
      85,
      0,
      (uri) => {
        if (!uri) {
          reject(new Error('Image could not be resized'));
          return;
        }
        const resizedFile = dataURLtoFile(uri as string, file.name);
        resolve(resizedFile);
      },
      'base64'
    );
  });
}

/**
 * Upload an image through the new pipeline:
 * 1. Client-side resize (opt-in, call resizeBeforeUpload first if desired)
 * 2. Send to server method
 * 3. Server runs Sharp, generates WebP variants, uploads to S3
 * 4. Returns the Images collection _id and all variant URLs
 */
export async function uploadImage(
  file: File,
  context: ImageContext = 'entry'
): Promise<UploadResult> {
  const base64 = await fileToBase64(file);
  const result = await Meteor.callAsync<UploadResult>('images.upload', base64, file.name, context);
  return result;
}
