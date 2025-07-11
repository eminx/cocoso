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

export const Tag = styled('span', (props: any) => ({
  alignItems: 'center',
  display: 'inline-flex',
  backgroundColor: props.bg || 'var(--cocoso-colors-gray-100)',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  padding: '0.25rem 0.5rem',
}));

interface TextProps {
  fontSize?: string;
  size?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  textAlign?: string;
}

export const Text = styled('p', (props: TextProps) => {
  const color = props.color?.split('.');
  const fontSize = props.size || props.fontSize;

  return {
    ...getPropStyles(props),
    color: color
      ? `var(--chakra-colors-${color[0]}-${color[1]})`
      : 'var(--cocoso-colors-gray-900)',
    fontSize: fontSize
      ? fontSizes[fontSize as keyof typeof fontSizes]
      : fontSizes.md,
    fontWeight: props.fontWeight || 'normal',
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
    color: color
      ? `var(--chakra-colors-${color[0]}-${color[1]})`
      : 'inherit',
    fontWeight: 700,
    fontSize: props.size ? headingSizes[props.size] : headingSizes.lg,
    lineHeight: 1.2,
    fontFamily: 'Raleway, sans-serif',
  };
});

export const Code = styled(Text, {
  fontFamily: 'monospace',
});

export const Link = styled('a', () => ({
  color: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
}));
