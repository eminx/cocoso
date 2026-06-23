import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Random } from 'meteor/random';

import { call } from '/imports/api/_utils/shared';
import Hosts from '/imports/api/hosts/host';
import Images from '/imports/api/images/image.collection';

import serverRenderer from './serverRenderer';
import './api';
import './migrations';

const { cdn_server } = Meteor.settings;

function setupSMTP() {
  const smtp = Meteor.settings?.mailCredentials?.smtp;

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${
    smtp.password
  }@${smtp.host}:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };
}

Meteor.startup(async () => {
  setupSMTP();

  if (cdn_server) {
    WebAppInternals.setBundledJsCssPrefix(cdn_server);
  }

  onPageLoad(async (sink) => {
    try {
      await serverRenderer(sink);
    } catch (error) {
      console.error('SSR Error:', error);
      // Fallback to client-side rendering or error page
      sink.renderIntoElementById('root', '<div>Server rendering failed</div>');
    }
  });

  // if (!Meteor.settings.enableImageMigration) return;

  // ---------------------------------------------------------------------------
  // Host logo migration
  // Migrates each host's `logo` URL to a WebP variant in S3 + Images collection.
  // Stores the old URL in `logoLegacy`. Skips already-migrated hosts.
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

  const s3 = new S3Client({
    region: AWS_REGION,
    credentials:
      AWS_ACCESS_KEY && AWS_SECRET
        ? { accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET }
        : undefined,
  });

  const LOGO_SIZES = [
    { suffix: 'thumb', width: 150, quality: 75 },
    { suffix: 'small', width: 300, quality: 80 },
    { suffix: 'medium', width: 600, quality: 85 },
    { suffix: 'full', width: 800, quality: 85 },
  ];

  console.log('[ImageMigration] Starting host logo migration...');
  let migratedCount = 0;
  let errorCount = 0;

  const hosts = await Hosts.find({
    logoLegacy: { $exists: false },
    logo: { $regex: '^https?://' },
  }).fetchAsync();

  console.log(
    `[ImageMigration] Found ${hosts.length} host(s) with unmigrated logos`
  );

  for (const host of hosts) {
    try {
      const logoUrl = host.logo;
      if (!logoUrl || !/^https?:\/\//i.test(logoUrl)) continue;

      // Skip already-migrated variant URLs
      if (/\/images\/.*\/(thumb|small|medium|full)\.(webp|jpg)/.test(logoUrl))
        continue;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15_000);
      let response;
      try {
        response = await fetch(logoUrl, { signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        console.warn(
          `[ImageMigration] Failed to fetch logo for ${host.host}: ${response.status}`
        );
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      if (!buffer || buffer.length === 0) {
        console.warn(`[ImageMigration] Empty buffer for logo: ${logoUrl}`);
        continue;
      }

      const metadata = await sharp(buffer).metadata();
      const originalWidth = metadata.width || 600;
      const originalHeight = metadata.height || 600;

      const imageId = Random.id();
      const folderKey = `images/migration/${imageId}`;
      const uploadedVariants = {};

      for (const size of LOGO_SIZES) {
        const resizeWidth = Math.min(size.width, originalWidth);
        const resized = await sharp(buffer)
          .resize(resizeWidth, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: size.quality, effort: 1, smartSubsample: true })
          .toBuffer();

        const key = `${folderKey}/${size.suffix}.webp`;
        await s3.send(
          new PutObjectCommand({
            Bucket: AWS_BUCKET,
            Key: key,
            Body: resized,
            ContentType: 'image/webp',
            ACL: 'public-read',
          })
        );
        uploadedVariants[
          size.suffix
        ] = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
      }

      const originalName = logoUrl.split('?')[0].split('/').pop() || 'logo';
      await Images.insertAsync({
        _id: imageId,
        host: host.host,
        uploadedBy: 'system',
        uploadedByUsername: 'migration',
        variants: uploadedVariants,
        context: 'avatar',
        originalName,
        originalSize: buffer.length,
        mimeType: `image/${metadata.format || 'jpeg'}`,
        width: originalWidth,
        height: originalHeight,
        createdAt: new Date(),
      });

      await Hosts.updateAsync(host._id, {
        $set: { logo: uploadedVariants.full, logoLegacy: logoUrl },
      });

      migratedCount++;
      console.log(
        `[ImageMigration] Migrated logo for host ${host.host} → ${imageId}`
      );
    } catch (err) {
      console.error(
        `[ImageMigration] Error migrating logo for host ${host._id}:`,
        err.message
      );
      errorCount++;
    }
  }

  console.log(
    `[ImageMigration] Completed logo migration: ${migratedCount} migrated, ${errorCount} errors`
  );
});
