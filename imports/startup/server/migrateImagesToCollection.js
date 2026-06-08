import { Meteor } from 'meteor/meteor';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Random } from 'meteor/random';
import Works from '/imports/api/works/work';
import Resources from '/imports/api/resources/resource';
import Groups from '/imports/api/groups/group';
import Activities from '/imports/api/activities/activity';
import Pages from '/imports/api/pages/page';
import ComposablePages from '/imports/api/composablepages/composablepage';
import Images from '/imports/api/images/image.collection';

/**
 * Image Migration Startup Script
 *
 * Migrates legacy image URLs to the new Images collection with WebP variants.
 * Preserves original URLs in `imagesLegacy` / `imageUrlLegacy` for fallback.
 * Runs on server startup when `enableImageMigration` is set in settings.
 *
 * Key behaviours:
 * - Deduplicates: same source URL → single Images document
 * - Skips docs without the target image field (does not create empty arrays)
 * - Matches production image sizes & WebP output from imageProcessor.ts
 * - Uses the same S3 URL pattern as the regular upload pipeline
 */

// ---------------------------------------------------------------------------
// AWS / S3 helpers – mirroring aws.upload.ts
// ---------------------------------------------------------------------------
const awsSettings = Meteor.settings?.AWSs3 || {};

const AWS_REGION =
  awsSettings.AWSRegion || process.env.AWS_REGION || 'eu-central-1';
const AWS_ACCESS_KEY =
  awsSettings.AWSAccessKeyId || process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET =
  awsSettings.AWSSecretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET =
  awsSettings.AWSBucketName || process.env.AWS_BUCKET_NAME || 'xyrden';

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials:
    AWS_ACCESS_KEY && AWS_SECRET
      ? { accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET }
      : undefined,
});

if (!AWS_ACCESS_KEY || !AWS_SECRET) {
  console.warn(
    '[ImageMigration] AWS credentials not fully provided; using default AWS credential chain.'
  );
}

async function uploadToS3(buffer, key, contentType = 'image/webp') {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: AWS_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    })
  );
  return `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

// ---------------------------------------------------------------------------
// Size configs – matching imageProcessor.ts
// ---------------------------------------------------------------------------
const SIZE_CONFIGS = {
  entry: [
    { suffix: 'thumb', width: 150, quality: 70 },
    { suffix: 'small', width: 400, quality: 80 },
    { suffix: 'medium', width: 800, quality: 85 },
    { suffix: 'full', width: 1200, quality: 85 },
  ],
  avatar: [
    { suffix: 'thumb', width: 150, quality: 75 },
    { suffix: 'small', width: 300, quality: 80 },
    { suffix: 'medium', width: 600, quality: 85 },
    { suffix: 'full', width: 600, quality: 85 },
  ],
};

const FETCH_TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Only match strings that look like an absolute HTTP(S) URL. */
function isUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

/**
 * If `value` is already an Images-collection _id (alphanumeric, 17+ chars,
 * SimpleSchema.RegEx.Id shape) we treat it as already migrated.
 */
function isAlreadyImageId(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9]{17,}$/.test(value);
}

// ---------------------------------------------------------------------------
// Image processing – mirrors processImage() but works on a remote URL
// ---------------------------------------------------------------------------
async function generateWebpVariants(buffer, context) {
  const sizes = SIZE_CONFIGS[context] || SIZE_CONFIGS.entry;
  const metadata = await sharp(buffer).metadata();
  const originalWidth = metadata.width || 1200;
  const originalHeight = metadata.height || 1200;

  const results = await Promise.all(
    sizes.map(async (size) => {
      const resizeWidth = Math.min(size.width, originalWidth);
      const resized = await sharp(buffer)
        .resize(resizeWidth, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: size.quality,
          effort: 4,
          nearLossless: false,
          smartSubsample: true,
        })
        .toBuffer();

      const meta = await sharp(resized).metadata();
      return {
        suffix: size.suffix,
        buffer: resized,
        width: meta.width || resizeWidth,
        height:
          meta.height ||
          Math.round(resizeWidth * (originalHeight / originalWidth)),
      };
    })
  );

  return {
    variants: results,
    metadata: {
      width: originalWidth,
      height: originalHeight,
      format: metadata.format || 'jpeg',
    },
  };
}

// ---------------------------------------------------------------------------
// Core migration of a single URL → Images document
// ---------------------------------------------------------------------------

/**
 * Download `url`, generate WebP variants, upload to S3, insert Images doc.
 * Returns the **full-variant S3 URL** (matching what ImageUploader stores),
 * or null on failure.
 *
 * `urlCache` is a Map<sourceUrl, fullVariantUrl> for deduplication.
 */
async function migrateOneUrl(
  url,
  urlCache,
  { host, uploadedBy, uploadedByUsername, context = 'entry' }
) {
  if (!url || !isUrl(url)) return null;
  if (!host) {
    console.warn(`[ImageMigration] Skipping ${url}: no host provided`);
    return null;
  }

  // Already migrated this URL in the current run?
  const cached = urlCache.get(url);
  if (cached !== undefined) return cached;

  // Skip URLs that are already pointing to our own S3 image variants
  if (/\/images\/.*\/(thumb|small|medium|full)\.(webp|jpg)/.test(url)) {
    urlCache.set(url, null);
    return null;
  }

  try {
    // Fetch with timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `[ImageMigration] Failed to fetch ${url}: ${response.status} ${response.statusText}`
      );
      urlCache.set(url, null);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer || buffer.length === 0) {
      console.warn(`[ImageMigration] Empty buffer for ${url}`);
      urlCache.set(url, null);
      return null;
    }

    // Generate WebP variants at correct sizes
    const { variants, metadata } = await generateWebpVariants(buffer, context);
    const imageId = Random.id();
    const folderKey = `images/migration/${imageId}`;

    // Upload all variants to S3 in parallel
    const uploadedVariants = {};
    const uploadResults = await Promise.all(
      variants.map(async (v) => {
        const key = `${folderKey}/${v.suffix}.webp`;
        const s3Url = await uploadToS3(v.buffer, key, 'image/webp');
        return { suffix: v.suffix, url: s3Url };
      })
    );
    for (const { suffix, url: s3Url } of uploadResults) {
      uploadedVariants[suffix] = s3Url;
    }

    const originalName = url.split('?')[0].split('/').pop() || 'legacy-image';

    const imageDoc = {
      _id: imageId,
      host,
      uploadedBy: uploadedBy || 'system',
      uploadedByUsername: uploadedByUsername || 'migration',
      variants: uploadedVariants,
      context,
      originalName,
      originalSize: buffer.length,
      mimeType: `image/${metadata.format}`,
      width: metadata.width,
      height: metadata.height,
      createdAt: new Date(),
    };

    await Images.insertAsync(imageDoc);
    console.log(`[ImageMigration] Created image doc ${imageId} from ${url}`);

    // Return the full variant URL — this is what gets stored in
    // the parent document's images[] / imageUrl field, exactly like
    // the ImageUploader flow does.
    const fullUrl = uploadedVariants.full;
    urlCache.set(url, fullUrl);
    return fullUrl;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`[ImageMigration] Timeout fetching ${url}`);
    } else {
      console.error(`[ImageMigration] Error migrating ${url}:`, err.message);
    }
    urlCache.set(url, null);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Users – avatar migration (special shape: { src, date })
// ---------------------------------------------------------------------------
async function migrateUsers(urlCache) {
  console.log('[ImageMigration] Starting migration for users...');

  const docs = await Meteor.users.find({}).fetchAsync();
  let migratedCount = 0;
  let errorCount = 0;

  for (const doc of docs) {
    try {
      const avatar = doc.avatar;
      if (!avatar) continue;

      let avatarUrl = null;
      let originalDate = null;
      let legacyAvatar = null;

      if (typeof avatar === 'string') {
        avatarUrl = avatar;
        legacyAvatar = { src: avatar, date: new Date() };
      } else if (typeof avatar === 'object' && avatar.src) {
        avatarUrl = avatar.src;
        originalDate = avatar.date;
        legacyAvatar = { src: avatar.src, date: avatar.date || new Date() };
      }

      if (!avatarUrl) continue;

      // Already an image ID? Skip.
      if (isAlreadyImageId(avatarUrl)) {
        continue;
      }

      const host = doc.memberships?.[0]?.host;
      if (!host) {
        console.warn(
          `[ImageMigration] User ${doc._id}: no membership host, skipping avatar`
        );
        continue;
      }

      const newUrl = await migrateOneUrl(avatarUrl, urlCache, {
        host,
        uploadedBy: doc._id,
        uploadedByUsername: doc.username || 'unknown',
        context: 'avatar',
      });

      if (newUrl) {
        await Meteor.users.updateAsync(doc._id, {
          $set: {
            avatar: { src: newUrl, date: originalDate || new Date() },
            avatarLegacy: legacyAvatar,
          },
        });
        migratedCount++;
      }
    } catch (err) {
      console.error(
        `[ImageMigration] Error processing user ${doc._id}:`,
        err.message
      );
      errorCount++;
    }
  }

  console.log(
    `[ImageMigration] Completed users: ${migratedCount} avatars migrated, ${errorCount} errors`
  );
}

// ---------------------------------------------------------------------------
// Generic collection migrator
// ---------------------------------------------------------------------------

const COLLECTION_MAP = {
  works: Works,
  resources: Resources,
  groups: Groups,
  activities: Activities,
  pages: Pages,
};

/**
 * Migrate image fields on a single collection.
 *
 * `imageFields` is an array of { field, isArray } descriptors.
 * For groups we also write `imageUrlLegacy` (single string) instead of
 * pushing into the generic `imagesLegacy` array.
 */
async function migrateCollection(collectionName, imageFields, urlCache) {
  console.log(`[ImageMigration] Starting migration for ${collectionName}...`);

  const collection = COLLECTION_MAP[collectionName];
  if (!collection) {
    console.warn(`[ImageMigration] Unknown collection: ${collectionName}`);
    return;
  }

  const docs = await collection.find({}).fetchAsync();
  let migratedCount = 0;
  let errorCount = 0;

  for (const doc of docs) {
    try {
      const host = doc.host;
      if (!host) {
        console.warn(
          `[ImageMigration] Skipping ${collectionName}/${doc._id}: no host field`
        );
        continue;
      }

      const updateData = {};
      const imagesLegacy = [];
      let anyMigrated = false;

      for (const { field, isArray, fallbackField } of imageFields) {
        // --- Skip if field is absent, null, or an empty array ---
        const fieldMissing = !(field in doc) || doc[field] == null;
        const arrayEmpty =
          isArray && Array.isArray(doc[field]) && doc[field].length === 0;

        if (fieldMissing || arrayEmpty) {
          // Fallback: if the array field is empty/missing and a fallbackField
          // is provided, use that single-value field as the image source.
          if (isArray && fallbackField) {
            const fallbackRaw = doc[fallbackField];
            if (!fallbackRaw) continue;

            let fallbackUrl = null;
            if (typeof fallbackRaw === 'string') {
              fallbackUrl = fallbackRaw;
            } else if (
              fallbackRaw &&
              typeof fallbackRaw === 'object' &&
              fallbackRaw.src
            ) {
              fallbackUrl = fallbackRaw.src;
            }
            if (!fallbackUrl || isAlreadyImageId(fallbackUrl)) continue;

            imagesLegacy.push(fallbackUrl);
            const newUrl = await migrateOneUrl(fallbackUrl, urlCache, {
              host,
              uploadedBy: doc.authorId || 'system',
              uploadedByUsername:
                doc.authorName || doc.authorUsername || 'migration',
              context: 'entry',
            });

            if (newUrl) {
              updateData[field] = [newUrl];
              migratedCount++;
              anyMigrated = true;
            }
          }
          continue;
        }

        const rawValue = doc[field];

        if (isArray) {
          // Array field: migrate each string URL in the array.
          // If the array contains objects we extract .src; otherwise treat as URL.
          if (!Array.isArray(rawValue) || rawValue.length === 0) continue;

          const newImageIds = [];
          for (const item of rawValue) {
            const url = typeof item === 'string' ? item : item?.src;
            if (!url) {
              // Preserve non-url items as-is
              newImageIds.push(item);
              continue;
            }

            // Already an image ID? Resolve it to the full variant URL.
            if (isAlreadyImageId(url)) {
              const existingDoc = await Images.findOneAsync(url);
              if (existingDoc?.variants?.full) {
                newImageIds.push(existingDoc.variants.full);
                // Don't add to imagesLegacy — it was already migrated
              } else {
                // Can't resolve, keep as-is (already broken)
                newImageIds.push(url);
              }
              continue;
            }

            imagesLegacy.push(url);
            const newUrl = await migrateOneUrl(url, urlCache, {
              host,
              uploadedBy: doc.authorId || 'system',
              uploadedByUsername:
                doc.authorName || doc.authorUsername || 'migration',
              context: 'entry',
            });

            if (newUrl) {
              newImageIds.push(newUrl);
              migratedCount++;
              anyMigrated = true;
            } else {
              // Migration failed – keep original URL so we don't lose data
              newImageIds.push(url);
            }
          }
          updateData[field] = newImageIds;
        } else {
          // Single-value field (e.g. groups.imageUrl)
          let url = null;
          if (typeof rawValue === 'string') {
            url = rawValue;
          } else if (rawValue && typeof rawValue === 'object' && rawValue.src) {
            url = rawValue.src;
          }

          if (!url) continue;

          // Already an image ID? Resolve to full variant URL.
          if (isAlreadyImageId(url)) {
            const existingDoc = await Images.findOneAsync(url);
            if (existingDoc?.variants?.full) {
              updateData[field] = existingDoc.variants.full;
              if (collectionName === 'groups') {
                // Can't recover the legacy URL, skip imageUrlLegacy
              }
              migratedCount++;
              anyMigrated = true;
            }
            continue;
          }

          const newUrl = await migrateOneUrl(url, urlCache, {
            host,
            uploadedBy: doc.authorId || 'system',
            uploadedByUsername:
              doc.authorName || doc.authorUsername || 'migration',
            context: 'entry',
          });

          if (newUrl) {
            updateData[field] = newUrl;
            // Groups: save legacy URL as single string, not in imagesLegacy array
            if (collectionName === 'groups') {
              updateData.imageUrlLegacy = url;
            }
            migratedCount++;
            anyMigrated = true;
          }
        }
      }

      // Persist changes
      if (anyMigrated) {
        // Only set imagesLegacy on collections whose schema includes it
        if (collectionName !== 'groups' && imagesLegacy.length > 0) {
          updateData.imagesLegacy = imagesLegacy;
        }
        try {
          await collection.updateAsync(doc._id, { $set: updateData });
        } catch (updErr) {
          console.error(
            `[ImageMigration] Error updating ${collectionName}/${doc._id}:`,
            updErr.message
          );
          errorCount++;
        }
      }
    } catch (err) {
      console.error(
        `[ImageMigration] Error processing ${collectionName}/${doc._id}:`,
        err.message
      );
      errorCount++;
    }
  }

  console.log(
    `[ImageMigration] Completed ${collectionName}: ${migratedCount} images migrated, ${errorCount} errors`
  );
}

// ---------------------------------------------------------------------------
// Composable pages – deep-nested image migration
// ---------------------------------------------------------------------------
async function migrateComposablePages(urlCache) {
  console.log('[ImageMigration] Starting migration for composablepages...');

  const docs = await ComposablePages.find({}).fetchAsync();
  let migratedCount = 0;
  let errorCount = 0;

  for (const doc of docs) {
    try {
      const host = doc.host;
      if (!host) {
        console.warn(
          `[ImageMigration] Skipping composablepages/${doc._id}: no host field`
        );
        continue;
      }

      let anyMigrated = false;
      const rows = doc.contentRows || [];

      for (const row of rows) {
        const columns = row.columns || [];
        for (const colModules of columns) {
          if (!Array.isArray(colModules)) continue;

          for (const mod of colModules) {
            if (!mod || !mod.type) continue;

            // --- Single image module ---
            if (
              mod.type === 'image' &&
              mod.value?.src &&
              isUrl(mod.value.src)
            ) {
              const src = mod.value.src;

              if (isAlreadyImageId(src)) {
                const existing = await Images.findOneAsync(src);
                if (existing?.variants?.full) {
                  mod.value.src = existing.variants.full;
                  anyMigrated = true;
                }
                continue;
              }

              // Skip already-migrated variant URLs
              if (
                /\/images\/.*\/(thumb|small|medium|full)\.(webp|jpg)/.test(src)
              )
                continue;

              const newUrl = await migrateOneUrl(src, urlCache, {
                host,
                uploadedBy: doc.authorId || 'system',
                uploadedByUsername: doc.authorUsername || 'migration',
                context: 'entry',
              });

              if (newUrl) {
                mod.value.srcLegacy = src;
                mod.value.src = newUrl;
                migratedCount++;
                anyMigrated = true;
              }
            }

            // --- Image slider module ---
            if (
              mod.type === 'image-slider' &&
              Array.isArray(mod.value?.images)
            ) {
              const legacyImages = [];
              const newImages = [];
              for (const img of mod.value.images) {
                const url = typeof img === 'string' ? img : img?.src;
                if (!url) {
                  newImages.push(img);
                  continue;
                }

                if (isAlreadyImageId(url)) {
                  const existing = await Images.findOneAsync(url);
                  newImages.push(existing?.variants?.full || url);
                  if (existing?.variants?.full) anyMigrated = true;
                  continue;
                }

                if (
                  /\/images\/.*\/(thumb|small|medium|full)\.(webp|jpg)/.test(
                    url
                  )
                ) {
                  newImages.push(url);
                  continue;
                }

                legacyImages.push(url);
                const newUrl = await migrateOneUrl(url, urlCache, {
                  host,
                  uploadedBy: doc.authorId || 'system',
                  uploadedByUsername: doc.authorUsername || 'migration',
                  context: 'entry',
                });

                if (newUrl) {
                  newImages.push(newUrl);
                  migratedCount++;
                  anyMigrated = true;
                } else {
                  newImages.push(url); // keep original on failure
                }
              }

              if (legacyImages.length > 0) {
                mod.value.imagesLegacy = legacyImages;
              }
              mod.value.images = newImages;
            }
          }
        }
      }

      if (anyMigrated) {
        try {
          await ComposablePages.updateAsync(doc._id, {
            $set: { contentRows: rows },
          });
        } catch (updErr) {
          console.error(
            `[ImageMigration] Error updating composablepages/${doc._id}:`,
            updErr.message
          );
          errorCount++;
        }
      }
    } catch (err) {
      console.error(
        `[ImageMigration] Error processing composablepages/${doc._id}:`,
        err.message
      );
      errorCount++;
    }
  }

  console.log(
    `[ImageMigration] Completed composablepages: ${migratedCount} images migrated, ${errorCount} errors`
  );
}

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------
Meteor.startup(async () => {
  if (!Meteor.settings.enableImageMigration) {
    console.log(
      '[ImageMigration] Skipped (set enableImageMigration: true in settings)'
    );
    return;
  }

  console.log('[ImageMigration] Starting image migration...');

  try {
    // Shared deduplication cache: URL → imageId
    const urlCache = new Map();

    // 1. Users – avatars
    await migrateUsers(urlCache);

    // 2. Works – images array
    await migrateCollection(
      'works',
      [{ field: 'images', isArray: true }],
      urlCache
    );

    // 3. Resources – images array
    await migrateCollection(
      'resources',
      [{ field: 'images', isArray: true }],
      urlCache
    );

    // 4. Groups – single imageUrl → imageUrlLegacy
    await migrateCollection(
      'groups',
      [{ field: 'imageUrl', isArray: false }],
      urlCache
    );

    // 5. Activities – images array (fallback to imageUrl if images is empty)
    await migrateCollection(
      'activities',
      [{ field: 'images', isArray: true, fallbackField: 'imageUrl' }],
      urlCache
    );

    // 6. Pages – images array
    await migrateCollection(
      'pages',
      [{ field: 'images', isArray: true }],
      urlCache
    );

    // 7. Composable pages – deep-nested image & image-slider modules
    await migrateComposablePages(urlCache);

    console.log('[ImageMigration] Migration completed successfully!');
  } catch (err) {
    console.error('[ImageMigration] Fatal error:', err.message);
  }
});
