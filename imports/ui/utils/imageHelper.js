"use strict";
/**
 * Client-side helper to resolve an image to its display URL.
 *
 * Handles two formats:
 * 1. New format: an object with { _id, variants: { thumb, small, medium, full } }
 * 2. Legacy format: a plain string URL (passed through as-is)
 */
exports.__esModule = true;
exports.getImageUrlThumb = exports.getImageUrlBest = exports.getImageUrl = void 0;
/**
 * Resolve an image reference to the most appropriate URL for a given display size.
 *
 * @param image - The image reference (string URL, variants object, or full doc)
 * @param size - The desired display size variant
 * @returns The image URL, or null if no image is available
 */
function getImageUrl(image, size) {
    if (size === void 0) { size = 'medium'; }
    if (!image)
        return null;
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
    if ('thumb' in image ||
        'small' in image ||
        'medium' in image ||
        'full' in image) {
        var variants = image;
        return variants[size] || variants.full || null;
    }
    return null;
}
exports.getImageUrl = getImageUrl;
function getImageUrlFromString(imageUrl, size) {
    var variantPattern = /^(https?:\/\/[^/]+\/images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/)(thumb|small|medium|full)(\.[a-zA-Z0-9]+)$/;
    var match = imageUrl.match(variantPattern);
    if (!match) {
        return imageUrl;
    }
    var prefix = match[1], extension = match[3];
    return "".concat(prefix).concat(size).concat(extension);
}
/**
 * Get the best available URL from an image reference,
 * preferring the largest available size.
 */
function getImageUrlBest(image) {
    return getImageUrl(image, 'full');
}
exports.getImageUrlBest = getImageUrlBest;
/**
 * Get the small/thumbnail URL — good for grid listings.
 */
function getImageUrlThumb(image) {
    return getImageUrl(image, 'thumb');
}
exports.getImageUrlThumb = getImageUrlThumb;
