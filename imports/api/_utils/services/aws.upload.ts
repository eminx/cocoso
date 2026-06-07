import { Meteor } from 'meteor/meteor';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';

interface S3Settings {
  AWSAccessKeyId: string;
  AWSSecretAccessKey: string;
  AWSBucketName: string;
  AWSBucketReadingMaterials: string;
  AWSRegion: string;
}

const s3Settings = Meteor.settings.AWSs3 as S3Settings;

let s3Client: S3Client;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: s3Settings.AWSRegion,
      credentials: {
        accessKeyId: s3Settings.AWSAccessKeyId,
        secretAccessKey: s3Settings.AWSSecretAccessKey,
      },
    });
  }
  return s3Client;
}

/**
 * Upload a file buffer to S3 with a given key and content type.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: s3Settings.AWSBucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await client.send(command);
  // Construct the public URL
  return `https://${s3Settings.AWSBucketName}.s3.${s3Settings.AWSRegion}.amazonaws.com/${key}`;
}

/**
 * Upload a file to the reading materials bucket.
 */
export async function uploadDocumentToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: s3Settings.AWSBucketReadingMaterials,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await client.send(command);

  return `https://${s3Settings.AWSBucketReadingMaterials}.s3.${s3Settings.AWSRegion}.amazonaws.com/${key}`;
}

/**
 * Delete a single object from S3 by its URL.
 */
export async function deleteFromS3(url: string): Promise<void> {
  const client = getS3Client();
  const { key, bucket } = parseS3Url(url);

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

/**
 * Delete multiple objects from S3 by their URLs.
 */
export async function deleteMultipleFromS3(urls: string[]): Promise<void> {
  const client = getS3Client();

  // Group by bucket
  const byBucket = new Map<string, ObjectIdentifier[]>();
  for (const url of urls) {
    const { key, bucket } = parseS3Url(url);
    const objects = byBucket.get(bucket) || [];
    objects.push({ Key: key });
    byBucket.set(bucket, objects);
  }

  for (const [bucket, objects] of byBucket) {
    const command = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: objects,
        Quiet: true,
      },
    });
    await client.send(command);
  }
}

/**
 * Parse an S3 URL to extract bucket and key.
 */
function parseS3Url(url: string): { bucket: string; key: string } {
  // Format: https://{bucket}.s3.{region}.amazonaws.com/{key}
  // Also handles: https://s3.{region}.amazonaws.com/{bucket}/{key}
  try {
    const urlObj = new URL(url);
    const hostParts = urlObj.hostname.split('.');

    if (hostParts[0] === 's3') {
      // Format: s3.{region}.amazonaws.com/{bucket}/{key}
      const [, , , , ...keyParts] = urlObj.pathname.split('/');
      return {
        bucket: urlObj.pathname.split('/')[1],
        key: keyParts.join('/'),
      };
    }

    // Format: {bucket}.s3.{region}.amazonaws.com/{key}
    const bucket = hostParts[0];
    const key = urlObj.pathname.substring(1); // remove leading '/'
    return { bucket, key };
  } catch {
    throw new Meteor.Error('Invalid S3 URL', `Cannot parse: ${url}`);
  }
}

export { s3Settings };
