export const borderRadiusOptions = [
  { label: 'none', value: '0' },
  { label: 'tiny', value: '0.125rem' },
  { label: 'small', value: '0.25rem' },
  { label: 'medium', value: '0.5rem' },
  { label: 'large', value: '1.25rem' },
  { label: 'xlarge', value: '2rem' },
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
  { label: 'none', value: '0' },
  { label: 'thin', value: '1px' },
  { label: 'medium', value: '2px' },
  { label: 'thick', value: '4px' },
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
    label: 'Gray',
    value: 'gray',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export const getGrayTheme = (theme) => ({
  hue: theme.hue, // Keep for potential reverse case
  variant: 'gray',
  body: {
    backgroundColor: 'var(--cocoso-colors-gray-100)',
    backgroundImage: 'none',
    backgroundRepeat: 'no-repeat',
    borderRadius: theme.body.borderRadius,
    fontFamily: theme.body.fontFamily || 'sans-serif',
  },
  menu: {
    backgroundColor: 'var(--cocoso-colors-gray-50)',
    borderColor: 'var(--cocoso-colors-gray-200)',
    borderRadius: theme.menu.borderRadius || '0.25rem',
    borderStyle: theme.menu.borderStyle || 'solid',
    borderWidth: theme.menu.borderWidth || '0px',
    color: 'var(--cocoso-colors-gray-800)',
    fontStyle: theme.menu.fontStyle || 'normal',
    textTransform: theme.menu.textTransform || 'none',
  },
});

export const getCustomTheme = (theme) => ({
  hue: theme.hue, // Keep for potential reverse case
  variant: 'custom',
  body: {
    backgroundColor: 'var(--cocoso-colors-theme-100)',
    backgroundImage: 'none',
    backgroundRepeat: 'no-repeat',
    borderRadius: theme.body.borderRadius || '0.25rem',
    fontFamily: theme.body.fontFamily || 'sans-serif',
  },
  menu: {
    backgroundColor: 'var(--cocoso-colors-theme-50)',
    borderColor: 'var(--cocoso-colors-theme-200)',
    borderRadius: theme.menu.borderRadius || '0.25rem',
    borderStyle: theme.menu.borderStyle || 'solid',
    borderWidth: theme.menu.borderWidth || '0px',
    color: 'var(--cocoso-colors-theme-800)',
    fontStyle: theme.menu.fontStyle || 'normal',
    textTransform: theme.menu.textTransform || 'none',
  },
});
