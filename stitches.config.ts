import React from 'react';
import { createStitches } from '@stitches/react';

// --- scales copied from old file
type SpaceScale = { [key: number]: string };
export const spaceScale: SpaceScale = {
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

type BorderRadiusScale = { [key: string]: string };
export const borderRadiusScale: BorderRadiusScale = {
  '0': '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1.25rem',
  xl: '2rem',
};

// --- helpers
export const xToRem = (x: any) => {
  if (!x || typeof Number(x) !== 'number') {
    return 'none';
  }
  return `${x * 0.25}rem`;
};

export const getSpacing = (value: string | number): string => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return spaceScale[0];
  }
  if (Number(value)) {
    return spaceScale[value as keyof typeof spaceScale];
  }
  return spaceScale[0];
};

export const getColor = (color: string) => {
  const colorParts = color?.split('.');
  if (!colorParts || colorParts.length !== 2) {
    return color;
  }
  return `var(--cocoso-colors-${colorParts[0]}-${colorParts[1]})`;
};

export const { styled, css, globalCss, getCssText } = createStitches();

// --- stitches config
// export const { styled, css, getCssText } = createStitches({
//   utils: {
//     // colors
//     bg: (value: string) => ({ backgroundColor: getColor(value) }),
//     color: (value: string) => ({ color: getColor(value) }),

//     // border radius
//     borderRadius: (value: keyof typeof borderRadiusScale) => ({
//       borderRadius: borderRadiusScale[value],
//     }),

//     // sizing
//     w: (value: any) => ({ width: value }),
//     h: (value: any) => ({ height: value }),
//     maxW: (value: any) => ({ maxWidth: value }),
//     maxH: (value: any) => ({ maxHeight: value }),
//     flex: (value: any) => ({ flex: value }),

//     // spacing (all go through xToRem)
//     p: (value: any) => ({ padding: xToRem(value) }),
//     px: (value: any) => ({ paddingInline: xToRem(value) }),
//     py: (value: any) => ({
//       paddingTop: xToRem(value),
//       paddingBottom: xToRem(value),
//     }),
//     pt: (value: any) => ({ paddingTop: xToRem(value) }),
//     pb: (value: any) => ({ paddingBottom: xToRem(value) }),
//     pl: (value: any) => ({ paddingInlineStart: xToRem(value) }),
//     pr: (value: any) => ({ paddingInlineEnd: xToRem(value) }),

//     m: (value: any) => ({ margin: xToRem(value) }),
//     mx: (value: any) => ({
//       marginLeft: xToRem(value),
//       marginRight: xToRem(value),
//     }),
//     my: (value: any) => ({
//       marginTop: xToRem(value),
//       marginBottom: xToRem(value),
//     }),
//     mt: (value: any) => ({ marginTop: xToRem(value) }),
//     mb: (value: any) => ({ marginBottom: xToRem(value) }),
//     ml: (value: any) => ({ marginLeft: xToRem(value) }),
//     mr: (value: any) => ({ marginRight: xToRem(value) }),

//     // gap / spacing
//     gap: (value: any) => ({ gap: xToRem(value) }),
//     spacing: (value: any) => ({ gap: xToRem(value) }),

//     // cursor
//     cursor: (value: any) => ({ cursor: value }),

//     // pseudo states
//     _hover: (value: any) => ({ '&:hover': value }),
//     _focus: (value: any) => ({ '&:focus': value }),
//     _active: (value: any) => ({ '&:active': value }),
//   },
// });
