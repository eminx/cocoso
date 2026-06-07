/**
 * Client-side helper to resolve an image to its display URL.
 *
 * Handles two formats:
 * 1. New format: an object with { _id, variants: { thumb, small, medium, full } }
 * 2. Legacy format: a plain string URL (passed through as-is)
 */

export type ImageSize = 'thumb' | 'small' | 'medium' | 'full';

interface ImageVariants {
  thumb?: string;
  small?: string;
  medium?: string;
  full?: string;
}

interface ImageDocument {
  _id: string;
  variants: ImageVariants;
}

interface ImageSrcObject {
  src?: string;
}

/**
 * An image reference can be:
 * - A plain string URL (legacy format from before the migration)
 * - An object with a `src` URL (avatar preview / legacy upload shape)
 * - An object with variants (new format from the Images collection)
 * - An Images collection document fetched from minimongo
 * - null/undefined
 */
export type ImageRef =
  | string
  | ImageSrcObject
  | ImageVariants
  | ImageDocument
  | null
  | undefined;

/**
 * Resolve an image reference to the most appropriate URL for a given display size.
 *
 * @param image - The image reference (string URL, variants object, or full doc)
 * @param size - The desired display size variant
 * @returns The image URL, or null if no image is available
 */
export function getImageUrl(
  image: ImageRef,
  size: ImageSize = 'medium'
): string | null {
  if (!image) return null;

  // Case 1: It's a plain string — legacy format or S3 URL. Try to derive a variant,
  // otherwise return the string unchanged.
  if (typeof image === 'string') {
    return getImageUrlFromString(image, size);
  }

  // Case 2: It's an ImageDocument with _id and variants
  if ('variants' in image && image.variants) {
    return image.variants[size] || image.variants.full || null;
  }

  // Case 3: It's an object with `src` property, such as legacy avatar shape.
  if ('src' in image && typeof image.src === 'string') {
    return getImageUrlFromString(image.src, size);
  }

  // Case 4: It's just a variants object directly
  if (
    'thumb' in image ||
    'small' in image ||
    'medium' in image ||
    'full' in image
  ) {
    const variants = image as ImageVariants;
    return variants[size] || variants.full || null;
  }

  return null;
}

function getImageUrlFromString(imageUrl: string, size: ImageSize): string {
  const variantPattern =
    /^(https?:\/\/[^/]+\/images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/)(thumb|small|medium|full)(\.[a-zA-Z0-9]+)$/;
  const match = imageUrl.match(variantPattern);

  if (!match) {
    return imageUrl;
  }

  const [, prefix, , extension] = match;
  return `${prefix}${size}${extension}`;
}

/**
 * Get the best available URL from an image reference,
 * preferring the largest available size.
 */
export function getImageUrlBest(image: ImageRef): string | null {
  return getImageUrl(image, 'full');
}

/**
 * Get the small/thumbnail URL — good for grid listings.
 */
export function getImageUrlThumb(image: ImageRef): string | null {
  return getImageUrl(image, 'thumb');
}
