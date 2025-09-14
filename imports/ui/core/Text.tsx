import React from 'react';
import { CSSProperties, styled } from '@stitches/react';

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
  textTransform: 'capitalize',
});

export const Tag = (props: any) => {
  const { children, ...rest } = props;
  const colorScheme = props.colorScheme || 'theme';
  const borderColor = `var(--cocoso-colors-${colorScheme}-500)`;
  const color = `var(--cocoso-colors-${colorScheme}-800)`;

  return (
    <TagStyled
      css={{
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
  css?: CSSProperties;
  fontSize?: string;
  fontWeight?: string;
  isTruncated?: boolean;
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
  const { children, ...rest } = props;
  const color = props.color?.split('.');
  const fontSize = props.size || props.fontSize;
  const truncated = props.isTruncated || props.truncated;

  return (
    <TextStyled
      css={{
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
        '&:hover': props._hover || {},
        '&:active': props._active || {},
        '&:focus': props._focus || {},
        ...props.css,
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
  css: CSSProperties;
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
  const { children, css, ...rest } = props;
  const color = props.color?.split('.');
  const truncated = props.isTruncated || props.truncated;

  return (
    <HeadingStyled
      css={{
        color: color
          ? `var(--cocoso-colors-${color[0]}-${color[1]})`
          : 'inherit',
        fontSize: props.size ? headingSizes[props.size] : headingSizes.lg,
        fontFamily: 'Raleway, sans-serif',
        fontWeight: props.fontWeight || 'bold',
        overflow: truncated ? 'hidden' : 'visible',
        lineHeight: props.lineHeight || '1.2',
        textAlign: props.textAlign || 'left',
        textOverflow: truncated ? 'ellipsis' : 'clip',
        whiteSpace: truncated ? 'nowrap' : 'normal',
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
  const { children, ...rest } = props;
  const color = props.color?.split('.') || ['blue', '500'];
  const fontSize = props.size || props.fontSize;
  const truncated = props.isTruncated || props.truncated || false;

  return (
    <LinkStyled
      css={{
        color: `var(--cocoso-colors-${color[0]}-${color[1]})`,
        fontSize: fontSize
          ? fontSizes[fontSize as keyof typeof fontSizes]
          : fontSizes.md,
        overflow: truncated ? 'hidden' : 'visible',
        textOverflow: truncated ? 'ellipsis' : 'clip',
        whiteSpace: truncated ? 'nowrap' : 'normal',
      }}
      {...rest}
    >
      {children}
    </LinkStyled>
  );
};
