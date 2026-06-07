import { Meteor } from 'meteor/meteor';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

/**
 * Image Migration Startup Script
 *
 * Migrates legacy image URLs to the new Images collection with variants.
 * Preserves original URLs in `imagesLegacy` array for fallback.
 * Runs on server startup with graceful error handling.
 */

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'cocoso-images';
const IMAGE_SIZES = ['thumb', 'small', 'medium', 'full'];
const BATCH_SIZE = 10;

async function generateVariants(buffer) {
  const variants = {};

  for (const size of IMAGE_SIZES) {
    try {
      let sizeConfig;
      switch (size) {
        case 'thumb':
          sizeConfig = { width: 150, height: 150, fit: 'cover' };
          break;
        case 'small':
          sizeConfig = { width: 300, height: 300, fit: 'cover' };
          break;
        case 'medium':
          sizeConfig = {
            width: 600,
            height: 600,
            fit: 'inside',
            withoutEnlargement: true,
          };
          break;
        case 'full':
          sizeConfig = {
            width: 1200,
            height: 1200,
            fit: 'inside',
            withoutEnlargement: true,
          };
          break;
      }

      const resized = await sharp(buffer).resize(sizeConfig).toBuffer();
      variants[size] = resized;
    } catch (err) {
      console.error(
        `[ImageMigration] Error generating ${size} variant:`,
        err.message
      );
      variants[size] = buffer; // Fallback to original
    }
  }

  return variants;
}

async function uploadVariantToS3(buffer, imageId, sizeKey) {
  try {
    const filename = `${imageId}/${sizeKey}.jpg`;
    const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/images/${filename}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `images/${filename}`,
        Body: buffer,
        ContentType: 'image/jpeg',
      })
    );

    return s3Url;
  } catch (err) {
    console.error(
      `[ImageMigration] Error uploading ${sizeKey} to S3:`,
      err.message
    );
    return null;
  }
}

async function migrateImageUrl(url, sourceCollection, sourceDocId) {
  if (!url || typeof url !== 'string') return null;

  try {
    // Skip already-migrated image documents
    if (
      url.includes('/images/') &&
      url.match(/\/(thumb|small|medium|full)\./)
    ) {
      return null;
    }

    // Fetch the image
    const response = await fetch(url, { timeout: 10000 });
    if (!response.ok) {
      console.warn(
        `[ImageMigration] Failed to fetch ${url}: ${response.statusText}`
      );
      return null;
    }

    const buffer = await response.buffer();
    if (!buffer || buffer.length === 0) {
      console.warn(`[ImageMigration] Empty buffer for ${url}`);
      return null;
    }

    // Generate variants
    const variants = await generateVariants(buffer);
    const imageId = uuidv4();

    // Upload to S3
    const uploadedVariants = {};
    for (const [sizeKey, variantBuffer] of Object.entries(variants)) {
      const s3Url = await uploadVariantToS3(variantBuffer, imageId, sizeKey);
      if (s3Url) {
        uploadedVariants[sizeKey] = s3Url;
      }
    }

    if (Object.keys(uploadedVariants).length === 0) {
      console.warn(`[ImageMigration] No variants uploaded for ${url}`);
      return null;
    }

    // Create image document
    const imageDoc = {
      _id: imageId,
      variants: uploadedVariants,
      sourceUrl: url,
      sourceCollection,
      sourceDocId,
      migratedAt: new Date(),
    };

    Meteor.call('createImageDocument', imageDoc, (err) => {
      if (err) {
        console.error(
          `[ImageMigration] Error creating image doc:`,
          err.message
        );
      } else {
        console.log(`[ImageMigration] Created image doc ${imageId}`);
      }
    });

    return imageId;
  } catch (err) {
    console.error(`[ImageMigration] Error migrating ${url}:`, err.message);
    return null;
  }
}

async function migrateNestedImages(
  content,
  collectionName,
  docId,
  imagesLegacy,
  imageMap
) {
  /**
   * Recursively migrate images in nested content structures
   * Handles: composable page modules, email content blocks, etc.
   */
  if (!content) return;

  if (Array.isArray(content)) {
    for (const item of content) {
      await migrateNestedImages(
        item,
        collectionName,
        docId,
        imagesLegacy,
        imageMap
      );
    }
  } else if (typeof content === 'object') {
    // Check for direct image URLs
    if (content.src && typeof content.src === 'string') {
      imagesLegacy.push(content.src);
      const newImageId = await migrateImageUrl(
        content.src,
        collectionName,
        docId
      );
      if (newImageId) {
        content.src = newImageId;
      }
    }

    // Check for image arrays
    if (content.images && Array.isArray(content.images)) {
      const migratedImages = [];
      for (const img of content.images) {
        let imageUrl = typeof img === 'string' ? img : img?.src;
        if (imageUrl) {
          imagesLegacy.push(imageUrl);
          const newImageId = await migrateImageUrl(
            imageUrl,
            collectionName,
            docId
          );
          if (newImageId) {
            migratedImages.push({ _id: newImageId, src: imageUrl });
          } else {
            migratedImages.push(img);
          }
        } else {
          migratedImages.push(img);
        }
      }
      content.images = migratedImages;
    }

    // Handle value object (composable page modules pattern)
    if (content.value && typeof content.value === 'object') {
      await migrateNestedImages(
        content.value,
        collectionName,
        docId,
        imagesLegacy,
        imageMap
      );
    }

    // Recursively process all nested objects
    for (const [key, value] of Object.entries(content)) {
      if (
        key !== 'src' &&
        key !== 'images' &&
        key !== 'value' &&
        typeof value === 'object' &&
        value !== null
      ) {
        await migrateNestedImages(
          value,
          collectionName,
          docId,
          imagesLegacy,
          imageMap
        );
      }
    }
  }
}

async function migrateCollection(collectionName, imageFields) {
  console.log(`[ImageMigration] Starting migration for ${collectionName}...`);

  const collection = Meteor.subscribe(collectionName)._mongo_collection;
  if (!collection) {
    console.warn(`[ImageMigration] Collection ${collectionName} not found`);
    return;
  }

  const docs = collection.find({}).fetch();
  let migratedCount = 0;
  let errorCount = 0;

  for (const doc of docs) {
    try {
      const imagesLegacy = [];
      const updateData = {};
      let anyImgMigrated = false;

      for (const fieldConfig of imageFields) {
        const { field, isArray, isNested } = fieldConfig;
        let imagesToMigrate = [];

        if (isNested) {
          // Handle nested images (e.g., in content blocks, composable pages)
          const nestedContent = doc[field];
          if (nestedContent) {
            const nestedCopy = JSON.parse(JSON.stringify(nestedContent));
            await migrateNestedImages(
              nestedCopy,
              collectionName,
              doc._id,
              imagesLegacy,
              {}
            );
            updateData[field] = nestedCopy;
            anyImgMigrated = true;
          }
          continue;
        }

        if (isArray) {
          // Handle image arrays (works, resources)
          const images = doc[field] || [];
          imagesToMigrate = Array.isArray(images) ? images : [images];
        } else {
          // Handle single image fields (avatar, imageUrl)
          const image = doc[field];
          if (image) {
            if (typeof image === 'object' && image.src) {
              imagesToMigrate = [image.src];
            } else if (typeof image === 'string') {
              imagesToMigrate = [image];
            }
          }
        }

        // Migrate each image
        for (const imageUrl of imagesToMigrate) {
          if (!imageUrl) continue;

          imagesLegacy.push(imageUrl);
          const newImageId = await migrateImageUrl(
            imageUrl,
            collectionName,
            doc._id
          );

          if (newImageId) {
            if (isArray) {
              if (!updateData[field]) updateData[field] = [];
              updateData[field].push({ _id: newImageId, src: imageUrl });
            } else {
              updateData[field] = newImageId;
            }
            migratedCount++;
            anyImgMigrated = true;
          }
        }
      }

      // Update document with legacy URLs and new image references
      if (anyImgMigrated || imagesLegacy.length > 0) {
        updateData.imagesLegacy = imagesLegacy;
        collection.update({ _id: doc._id }, { $set: updateData }, (err) => {
          if (err) {
            console.error(
              `[ImageMigration] Error updating ${collectionName} doc ${doc._id}:`,
              err.message
            );
            errorCount++;
          }
        });
      }
    } catch (err) {
      console.error(
        `[ImageMigration] Error processing doc in ${collectionName}:`,
        err.message
      );
      errorCount++;
    }
  }

  console.log(
    `[ImageMigration] Completed ${collectionName}: ${migratedCount} images migrated, ${errorCount} errors`
  );
}

Meteor.startup(async () => {
  if (!Meteor.settings.enableImageMigration) {
    console.log(
      '[ImageMigration] Skipped (set enableImageMigration: true in settings)'
    );
    return;
  }

  console.log('[ImageMigration] Starting image migration...');

  try {
    // Users avatars
    await migrateCollection('users', [
      { field: 'avatar', isArray: false, isNested: false },
    ]);

    // Works images
    await migrateCollection('works', [
      { field: 'images', isArray: true, isNested: false },
    ]);

    // Resources images
    await migrateCollection('resources', [
      { field: 'images', isArray: true, isNested: false },
    ]);

    // Groups imageUrl (singular)
    await migrateCollection('groups', [
      { field: 'imageUrl', isArray: false, isNested: false },
    ]);

    // Activities images (array)
    await migrateCollection('activities', [
      { field: 'images', isArray: true, isNested: false },
    ]);

    // Composable pages (nested modules with images)
    await migrateCollection('composablepages', [
      { field: 'modules', isArray: false, isNested: true },
      { field: 'content', isArray: false, isNested: true },
    ]);

    console.log('[ImageMigration] Migration completed successfully!');
  } catch (err) {
    console.error('[ImageMigration] Fatal error:', err.message);
  }
});
