// stitches.config.ts
import { createStitches } from '@stitches/react';

// --- Scales ---
export const spaceScale = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
};

export const borderRadiusScale = {
  '0': '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1.25rem',
  xl: '2rem',
};

// --- Helpers ---
const xToRem = (x: any) => {
  if (!x || typeof Number(x) !== 'number') return 'none';
  return `${x * 0.25}rem`;
};

// flatten nested color palette → { "brand-100": "#...", "gray-900": "#..." }
const flattenColors = (obj: any, prefix = ''): Record<string, string> =>
  Object.entries(obj).reduce((acc, [key, val]) => {
    if (typeof val === 'object') {
      Object.assign(acc, flattenColors(val, `${prefix}${key}-`));
    } else {
      acc[`${prefix}${key}`] = val as string;
    }
    return acc;
  }, {} as Record<string, string>);

// turn "brand.100" → "$brand-100"
const parseColor = (color: string) => {
  const colorParts = color?.split('.');
  if (!colorParts || colorParts.length !== 2) return color;
  return `$${colorParts[0]}-${colorParts[1]}`;
};

// --- Palette definition (nested) ---
const palette = {
  brand: {
    100: '#f0f5ff',
    500: '#2b6cb0',
  },
  gray: {
    100: '#f7fafc',
    900: '#1a202c',
  },
  // add more...
};

// --- Type magic ---
// Convert nested {brand: {100: '#'}} to "brand.100"
type DotPaths<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? DotPaths<T[K], `${Prefix}${Extract<K, string>}.`>
    : `${Prefix}${Extract<K, string>}`;
}[keyof T];

export type ColorToken = DotPaths<typeof palette>; // "brand.100" | "brand.500" | "gray.100" | "gray.900"

// --- Config ---
export const { styled, css, theme, globalCss, keyframes, getCssText } =
  createStitches({
    theme: {
      space: spaceScale,
      radii: borderRadiusScale,
      colors: flattenColors(palette),
    },

    utils: {
      // Colors
      bg: (value: ColorToken) => ({
        backgroundColor: parseColor(value),
      }),
      color: (value: ColorToken) => ({
        color: parseColor(value),
      }),
      bc: (value: ColorToken) => ({
        borderColor: parseColor(value),
      }),

      // Border radius
      br: (value: keyof typeof borderRadiusScale) => ({
        borderRadius: borderRadiusScale[value],
      }),

      // Width / height
      w: (value: any) => ({ width: value }),
      h: (value: any) => ({ height: value }),
      maxW: (value: any) => ({ maxWidth: value }),
      maxH: (value: any) => ({ maxHeight: value }),
      flex: (value: any) => ({ flex: value }),

      // Padding
      p: (value: any) => ({ padding: xToRem(value) }),
      px: (value: any) => ({
        paddingLeft: xToRem(value),
        paddingRight: xToRem(value),
      }),
      py: (value: any) => ({
        paddingTop: xToRem(value),
        paddingBottom: xToRem(value),
      }),
      pt: (value: any) => ({ paddingTop: xToRem(value) }),
      pr: (value: any) => ({ paddingRight: xToRem(value) }),
      pb: (value: any) => ({ paddingBottom: xToRem(value) }),
      pl: (value: any) => ({ paddingLeft: xToRem(value) }),

      // Margin
      m: (value: any) => ({ margin: xToRem(value) }),
      mx: (value: any) => ({
        marginLeft: xToRem(value),
        marginRight: xToRem(value),
      }),
      my: (value: any) => ({
        marginTop: xToRem(value),
        marginBottom: xToRem(value),
      }),
      mt: (value: any) => ({ marginTop: xToRem(value) }),
      mr: (value: any) => ({ marginRight: xToRem(value) }),
      mb: (value: any) => ({ marginBottom: xToRem(value) }),
      ml: (value: any) => ({ marginLeft: xToRem(value) }),

      // Pseudos
      _hover: (styles: any) => ({
        '&:hover': styles,
      }),
      _focus: (styles: any) => ({
        '&:focus': styles,
      }),
      _active: (styles: any) => ({
        '&:active': styles,
      }),
    },
  });
