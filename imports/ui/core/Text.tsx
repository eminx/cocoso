import { styled } from 'restyle';

import { getPropStyles } from './functions';

const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
};

export const Tag = styled('span', (props: any) => {
  const colorScheme = props.colorScheme || 'theme';
  const backgroundColor = `var(--cocoso-colors-${colorScheme}-600)`;
  const color = `var(--cocoso-colors-${colorScheme}-50)`;

  return {
    alignItems: 'center',
    display: 'inline-flex',
    backgroundColor,
    borderRadius: 'var(--cocoso-border-radius)',
    color,
    fontSize: '0.875rem',
    fontWeight: '400',
    padding: '0.25rem 0.5rem',
    textTransform: 'capitalize',
  };
});

interface TextProps {
  fontSize?: string;
  size?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  textAlign?: string;
  _hover?: any;
  _active?: any;
  _focus?: any;
  isTruncated?: boolean;
  truncated?: boolean;
}

export const Text = styled('span', (props: TextProps) => {
  const color = props.color?.split('.');
  const fontSize = props.size || props.fontSize;
  const truncated = props.isTruncated || props.truncated;

  return {
    color: color
      ? `var(--cocoso-colors-${color[0]}-${color[1]})`
      : 'var(--cocoso-colors-gray-900)',
    fontSize: fontSize
      ? fontSizes[fontSize as keyof typeof fontSizes]
      : fontSizes.md,
    fontWeight: props.fontWeight || 'normal',
    textOverflow: truncated ? 'ellipsis' : 'clip',
    overflow: truncated ? 'hidden' : 'visible',
    whiteSpace: truncated ? 'nowrap' : 'normal',
    ':hover': props._hover || {},
    ':active': props._active || {},
    ':focus': props._focus || {},
    // marginBottom: props.mb || '0',
    ...getPropStyles(props),
  };
});

// Heading
interface HeadingProps {
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const headingSizes = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
  '2xl': '3rem',
};

export const Heading = styled('h2', (props: HeadingProps) => {
  const color = props.color?.split('.');
  return {
    ...getPropStyles(props),
    color: color ? `var(--cocoso-colors-${color[0]}-${color[1]})` : 'inherit',
    fontWeight: 700,
    fontSize: props.size ? headingSizes[props.size] : headingSizes.lg,
    lineHeight: 1.2,
    fontFamily: 'Raleway, sans-serif',
  };
});

interface CodeProps {
  fontSize?: string;
  size?: string;
  color?: string;
}

export const Code = styled('span', (props: CodeProps) => {
  const fontSize = props.size || props.fontSize;
  const color = props.color?.split('.');
  return {
    color: color ? `var(--cocoso-colors-${color[0]}-${color[1]})` : 'inherit',
    padding: '0.25rem 0.5rem',
    margin: '0 0.25rem',
    borderRadius: 'var(--cocoso-border-radius)',
    backgroundColor: 'var(--cocoso-colors-bluegray-50)',
    fontFamily: 'monospace',
    fontSize: fontSize
      ? fontSizes[fontSize as keyof typeof fontSizes]
      : fontSizes.md,
  };
});

export const Link = styled('a', () => ({
  color: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
}));
