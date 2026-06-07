import sharp from 'sharp';

export interface ImageVariantUrls {
  thumb: string;   // 150px
  small: string;   // 400px
  medium: string;  // 800px
  full: string;    // 1200px
}

export interface ProcessedImage {
  variants: ImageVariantUrls;
  width: number;
  height: number;
  format: string;
}

export type ImageContext = 'entry' | 'avatar' | 'logo';

interface SizeConfig {
  suffix: keyof ImageVariantUrls;
  width: number;
  /** WebP quality for this size variant: lower for tiny thumbs, higher for full size */
  quality: number;
}

const CONTEXT_SIZES: Record<ImageContext, SizeConfig[]> = {
  entry: [
    { suffix: 'thumb', width: 150, quality: 70 },
    { suffix: 'small', width: 400, quality: 80 },
    { suffix: 'medium', width: 800, quality: 85 },
    { suffix: 'full', width: 1200, quality: 85 },
  ],
  avatar: [
    { suffix: 'thumb', width: 150, quality: 75 },
    { suffix: 'small', width: 300, quality: 80 },
    { suffix: 'full', width: 600, quality: 85 },
  ],
  // Used for both hostLogo and platformLogo
  logo: [
    { suffix: 'small', width: 200, quality: 80 },
    { suffix: 'medium', width: 400, quality: 85 },
    { suffix: 'full', width: 800, quality: 85 },
  ],
};

/**
 * Process a raw image buffer through Sharp:
 * 1. Generate WebP variants at multiple sizes
 * 2. Return buffers + metadata for each variant
 */
export async function processImage(
  fileBuffer: Buffer,
  context: ImageContext = 'entry'
): Promise<{
  variants: {
    suffix: keyof ImageVariantUrls;
    buffer: Buffer;
    width: number;
    height: number;
  }[];
  metadata: { width: number; height: number; format: string };
}> {
  // Get original metadata
  const metadata = await sharp(fileBuffer).metadata();
  const originalWidth = metadata.width || 1200;
  const originalHeight = metadata.height || 1200;
  const format = metadata.format || 'jpeg';

  const sizes = CONTEXT_SIZES[context];

  // Process each size variant
  const variantResults = await Promise.all(
    sizes.map(async (size) => {
      const pipeline = sharp(fileBuffer);

      // Only resize if the original is larger than the target width
      const resizeWidth = Math.min(size.width, originalWidth);

      const buffer = await pipeline
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

      const resultMeta = await sharp(buffer).metadata();

      return {
        suffix: size.suffix as keyof ImageVariantUrls,
        buffer,
        width: resultMeta.width || resizeWidth,
        height: resultMeta.height || Math.round(resizeWidth * (originalHeight / originalWidth)),
      };
    })
  );

  return {
    variants: variantResults,
    metadata: {
      width: originalWidth,
      height: originalHeight,
      format,
    },
  };
}

export { CONTEXT_SIZES };
