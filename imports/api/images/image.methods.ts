import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';

import Images from './image.collection';
import { processImage, ImageVariantUrls, ImageContext } from '../_utils/services/imageProcessor';
import { uploadToS3 } from '../_utils/services/aws.upload';
import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';

/**
 * Upload an image: receive a buffer from the client,
 * process it with Sharp, upload all variants to S3,
 * save the record in the Images collection.
 */
async function uploadImageMethod(
  fileBufferBase64: string,
  originalName: string,
  context: ImageContext = 'entry'
): Promise<{
  _id: string;
  variants: ImageVariantUrls;
}> {
  const user = await Meteor.userAsync();
  if (!user) {
    throw new Meteor.Error('not-authorized', 'You must be logged in to upload images');
  }

  const host = getHost(this);
  const currentHost = await Hosts.findOneAsync({ host });

  if (!currentHost) {
    throw new Meteor.Error('invalid-host', 'Host not found');
  }

  // Decode base64 to buffer
  const fileBuffer = Buffer.from(fileBufferBase64, 'base64');

  // Process with Sharp
  const { variants, metadata } = await processImage(fileBuffer, context);

  // Generate a unique folder key for S3
  const uniqueId = Random.id();
  const folderKey = `images/${user._id}/${uniqueId}`;

  // Upload all variants to S3 in parallel
  const uploadResults = await Promise.all(
    variants.map(async (variant) => {
      const key = `${folderKey}/${variant.suffix}.webp`;
      const url = await uploadToS3(key, 'image/webp');
      return { suffix: variant.suffix, url };
    })
  );

  // Build the variants object
  const variantUrls = {} as ImageVariantUrls;
  for (const result of uploadResults) {
    variantUrls[result.suffix as keyof ImageVariantUrls] = result.url;
  }

  // Save to DB
  const imageId = await Images.insertAsync({
    host,
    uploadedBy: user._id,
    uploadedByUsername: user.username || 'unknown',
    variants: variantUrls,
    context,
    originalName,
    originalSize: fileBuffer.length,
    mimeType: `image/${metadata.format}`,
    width: metadata.width,
    height: metadata.height,
    createdAt: new Date(),
  });

  return {
    _id: imageId,
    variants: variantUrls,
  };
}

/**
 * Delete an image and its S3 objects.
 */
async function deleteImageMethod(imageId: string) {
  check(imageId, String);
  const user = await Meteor.userAsync();
  if (!user) {
    throw new Meteor.Error('not-authorized');
  }

  const image = await Images.findOneAsync(imageId);
  if (!image) {
    throw new Meteor.Error('not-found', 'Image not found');
  }

  // Only the uploader or a super admin can delete
  if (image.uploadedBy !== user._id && !user.isSuperAdmin) {
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost?.members?.some(
      (m: any) => m.id === user._id && m.role === 'admin'
    );
    if (!isAdmin) {
      throw new Meteor.Error('not-authorized', 'You cannot delete this image');
    }
  }

  // Delete all variants from S3
  const variantUrls = Object.values(image.variants) as string[];
  const { deleteMultipleFromS3 } = await import('../_utils/services/aws.upload');
  await deleteMultipleFromS3(variantUrls);

  // Remove from DB
  await Images.removeAsync(imageId);
}

Meteor.methods({
  'images.upload'(fileBufferBase64: string, originalName: string, context: ImageContext) {
    return uploadImageMethod.call(this, fileBufferBase64, originalName, context);
  },

  'images.delete'(imageId: string) {
    return deleteImageMethod.call(this, imageId);
  },
});
