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
  const borderColor = `var(--cocoso-colors-${colorScheme}-500)`;
  const color = `var(--cocoso-colors-${colorScheme}-800)`;

  return {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor,
    borderRadius: 'var(--cocoso-border-radius)',
    borderWidth: '1px',
    borderStyle: 'solid',
    color,
    display: 'inline-flex',
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.35rem',
    paddingInline: '0.55rem',
    textTransform: 'lowercase',
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
    ...getPropStyles(props),
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
    lineHeight: props.lineHeight || 'normal',
    textAlign: props.textAlign || 'left',
    ':hover': props._hover || {},
    ':active': props._active || {},
    ':focus': props._focus || {},
  };
});

// Heading
interface HeadingProps extends TextProps {
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
  const truncated = props.isTruncated || props.truncated;

  return {
    ...getPropStyles(props),
    color: color ? `var(--cocoso-colors-${color[0]}-${color[1]})` : 'inherit',
    fontSize: props.size ? headingSizes[props.size] : headingSizes.lg,
    fontFamily: 'Raleway, sans-serif',
    fontWeight: props.fontWeight || 'bold',
    overflow: truncated ? 'hidden' : 'visible',
    lineHeight: props.lineHeight || '1.2',
    textAlign: props.textAlign || 'left',
    textOverflow: truncated ? 'ellipsis' : 'clip',
    whiteSpace: truncated ? 'nowrap' : 'normal',
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

export const Link = styled('a', (props: TextProps) => {
  const color = props.color?.split('.') || ['blue', '500'];
  const truncated = props.isTruncated || props.truncated || false;

  return {
    color: `var(--cocoso-colors-${color[0]}-${color[1]})`,
    cursor: 'pointer',
    overflow: truncated ? 'hidden' : 'visible',
    textOverflow: truncated ? 'ellipsis' : 'clip',
    whiteSpace: truncated ? 'nowrap' : 'normal',
    ':hover': {
      textDecoration: 'underline',
    },
  };
});
