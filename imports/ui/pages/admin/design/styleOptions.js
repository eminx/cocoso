import React from 'react';
import { Trans } from 'react-i18next';

export const borderRadiusOptions = [
  { label: 'None', value: '0' },
  { label: 'Tiny', value: '0.125rem' },
  { label: 'Small', value: '0.25rem' },
  { label: 'Medium', value: '0.5rem' },
  { label: 'Large', value: '1.25rem' },
  { label: 'X-Large', value: '2rem' },
];

export const borderStyleOptions = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Double', value: 'double' },
  { label: 'Groove', value: 'groove' },
  { label: 'Ridge', value: 'ridge' },
  { label: 'Inset', value: 'inset' },
  { label: 'Outset', value: 'outset' },
];

export const borderWidthOptions = [
  { label: 'None', value: '0' },
  { label: 'Thin (1px)', value: '1px' },
  { label: 'Medium (2px)', value: '2px' },
  { label: 'Thick (4px)', value: '4px' },
];

export const fontStyleOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Italic', value: 'italic' },
];

export const textTransformOptions = [
  { label: 'None', value: 'none' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Lowercase', value: 'lowercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

export const themeOptions = [
  {
    label: <Trans i18nKey="admin:design.themes.gray" />,
    value: 'gray',
  },
  {
    label: <Trans i18nKey="admin:design.themes.custom" />,
    value: 'custom',
  },
];
