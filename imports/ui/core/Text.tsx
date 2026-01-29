import React from 'react';
import { CSSProperties } from '@stitches/react';

import { styled } from '/stitches.config';

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

const TagStyled = styled('span', {
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: 'var(--cocoso-border-radius)',
  borderWidth: '1px',
  borderStyle: 'solid',
  display: 'inline-flex',
  fontSize: '0.875rem',
  fontWeight: '400',
  lineHeight: '1.35rem',
  paddingInline: '0.55rem',
});

export const Tag = (props: any) => {
  const { children, colorScheme = 'theme', ...rest } = props;
  const borderColor = `var(--cocoso-colors-${colorScheme}-500)`;
  const color = `var(--cocoso-colors-${colorScheme}-800)`;
  const backgroundColor = `var(--cocoso-colors-${colorScheme}-50)`;

  return (
    <TagStyled
      css={{
        backgroundColor,
        borderColor,
        color,
      }}
      {...rest}
    >
      {children}
    </TagStyled>
  );
};

interface TextProps {
  color?: string;
  colorScheme?: string;
  css?: CSSProperties;
  fontSize?: string;
  fontWeight?: string;
  href?: string;
  lineHeight?: string;
  textAlign?: string;
  size?: string;
  truncated?: boolean;
  children: React.ReactNode;
  _hover?: any;
  _active?: any;
  _focus?: any;
}

const TextStyled = styled('span', {});

export const Text = (props: TextProps) => {
  const {
    children,
    color,
    colorScheme,
    css,
    fontSize,
    fontWeight = 'normal',
    lineHeight = 'normal',
    size,
    textAlign = 'left',
    truncated,
    _hover,
    _active,
    _focus,
    ...rest
  } = props;
  const colorValue = color?.split('.') || colorScheme;
  const fontSizeValue = size || fontSize;
  const truncatedValue = truncated || false;

  return (
    <TextStyled
      css={{
        color: colorValue
          ? `var(--cocoso-colors-${colorValue[0]}-${colorValue[1]})`
          : 'var(--cocoso-colors-gray-900)',
        fontSize: fontSizeValue
          ? fontSizes[fontSizeValue as keyof typeof fontSizes]
          : fontSizes.md,
        fontWeight,
        textOverflow: truncatedValue ? 'ellipsis' : 'clip',
        overflow: truncatedValue ? 'hidden' : 'visible',
        whiteSpace: truncatedValue ? 'nowrap' : 'normal',
        lineHeight,
        textAlign,
        '&:hover': _hover || {},
        '&:active': _active || {},
        '&:focus': _focus || {},
        ...getPropStyles(props),
        ...css,
      }}
      {...rest}
    >
      {children}
    </TextStyled>
  );
};

// Heading
interface HeadingProps extends TextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  css?: CSSProperties;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const headingSizes = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
  '2xl': '3rem',
};

const HeadingStyled = styled('h2', {});

export const Heading = (props: HeadingProps) => {
  const {
    children,
    fontWeight,
    lineHeight,
    size,
    textAlign,
    truncated = false,
    css,
    ...rest
  } = props;
  const color = props.color?.split('.');

  return (
    <HeadingStyled
      css={{
        color: color
          ? `var(--cocoso-colors-${color[0]}-${color[1]})`
          : 'inherit',
        fontSize: size ? headingSizes[size] : headingSizes.lg,
        fontFamily: 'Raleway, sans-serif',
        fontWeight: fontWeight || 'bold',
        overflow: truncated ? 'hidden' : 'visible',
        lineHeight: lineHeight || '1.2',
        textAlign: textAlign || 'left',
        textOverflow: truncated ? 'ellipsis' : 'clip',
        whiteSpace: truncated ? 'pre-wrap' : 'normal',
        ...getPropStyles(props),
        ...css,
      }}
      {...rest}
    >
      {children}
    </HeadingStyled>
  );
};

interface CodeProps {
  fontSize?: string;
  size?: string;
  color?: string;
}

const CodeStyled = styled('span', {
  borderRadius: 'var(--cocoso-border-radius)',
  backgroundColor: 'var(--cocoso-colors-bluegray-50)',
  fontFamily: 'monospace',
  padding: '0.25rem 0.5rem',
  margin: '0 0.25rem',
});

export const Code = (props: CodeProps & { children?: React.ReactNode }) => {
  const { children, ...rest } = props;
  const color = props.color?.split('.');
  const fontSize = props.size || props.fontSize;

  return (
    <CodeStyled
      css={{
        color: color
          ? `var(--cocoso-colors-${color[0]}-${color[1]})`
          : 'inherit',
        fontSize: fontSize
          ? fontSizes[fontSize as keyof typeof fontSizes]
          : fontSizes.md,
        overflowWrap: 'anywhere',
      }}
      {...rest}
    >
      {children}
    </CodeStyled>
  );
};

const LinkStyled = styled('a', {
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const Link = (props: TextProps) => {
  const { children, css, color, fontSize, size, truncated, ...rest } = props;
  const colorValue = color?.split('.') || ['blue', '500'];
  const fontSizeValue = size || fontSize;
  const truncatedValue = truncated || false;

  return (
    <LinkStyled
      css={{
        color: `var(--cocoso-colors-${colorValue[0]}-${colorValue[1]})`,
        fontSize: fontSize
          ? fontSizes[fontSizeValue as keyof typeof fontSizes]
          : fontSizes.md,
        overflow: truncatedValue ? 'hidden' : 'visible',
        textOverflow: truncatedValue ? 'ellipsis' : 'clip',
        whiteSpace: truncatedValue ? 'nowrap' : 'normal',
        ...css,
      }}
      {...rest}
    >
      {children}
    </LinkStyled>
  );
};
