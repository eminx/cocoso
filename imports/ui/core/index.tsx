import React, { ReactNode } from 'react';
import { styled } from 'restyle';

import Checkbox from '/imports/ui/forms/Checkbox';

// Spacing
type SpaceScale = {
  [key: number]: string;
};

const spaceScale: SpaceScale = {
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

const getSpacing = (value: string | number): string => {
  // Handle non-string/non-number values (like Symbols)
  if (typeof value !== 'string' && typeof value !== 'number') {
    return spaceScale[0];
  }

  if (Number(value)) {
    return spaceScale[value as keyof typeof spaceScale];
  }
  return spaceScale[0];
};

const xToRem = (x: any) => {
  if (!x || typeof Number(x) !== 'number') {
    return 'none';
  }
  return `${x * 0.25}rem`;
};

const getColor = (color: string) => {
  const colorParts = color?.split('.');
  if (!colorParts || colorParts.length !== 2) {
    return color;
  }

  return colorParts
    ? `var(--chakra-colors-${colorParts[0]}-${colorParts[1]})`
    : 'gray.900';
};

const getPropStyles = (props: any) => {
  const styles = {
    ...(props.bg && {
      backgroundColor: getColor(props.bg),
    }),
    // borderRadius: props.borderRadius || 'var(--cocoso-border-radius)',
    ...(props.color && {
      color: getColor(props.color),
    }),
    ...(props.cursor && {
      cursor: props.cursor,
    }),
    ...(props.h && {
      height: props.h,
    }),
    ...(props.maxH && {
      maxHeight: props.maxH,
    }),
    ...(props.maxW && {
      maxWidth: props.maxW,
    }),
    ...(props.w && {
      width: props.w,
    }),
    ...(props.pl && {
      paddingInlineStart: xToRem(props.pl),
    }),
    ...(props.pr && {
      paddingInlineEnd: xToRem(props.pr),
    }),
    ...(props.px && {
      paddingInline: xToRem(props.px),
    }),
    ...(props.pt && {
      paddingTop: xToRem(props.pt),
    }),
    ...(props.pb && {
      paddingBottom: xToRem(props.pb),
    }),
    ...(props.py && {
      paddingTop: xToRem(props.pt || props.py),
      paddingBottom: xToRem(props.pb || props.py),
    }),
    ...(props.p && {
      padding: xToRem(props.p),
    }),
    ...(props.mx && {
      marginInline: xToRem(props.mx),
      marginInlineStart: xToRem(props.ml),
      marginInlineEnd: xToRem(props.mr),
    }),
    ...(props.mt && {
      marginTop: xToRem(props.mt),
    }),
    ...(props.mb && {
      marginBottom: xToRem(props.mb),
    }),
    ...(props.my && {
      marginTop: xToRem(props.my),
      marginBottom: xToRem(props.my),
    }),
    ...(props.m && {
      margin: xToRem(props.m),
    }),
    ...(props._hover && {
      ':hover': {
        ...props.hover,
      },
    }),
    ...(props._focus && {
      ':focus': {
        ...props._focus,
      },
    }),
    ...(props._active && {
      ':active': {
        ...props._active,
      },
    }),
  };

  return styles;
};

// Box
export const Box = styled('div', (props: any) => ({
  display: 'block',
  ...getPropStyles(props),
}));

// Alert
interface AlertProps {
  status?: 'info' | 'warning' | 'success' | 'error';
}

const alertColors = {
  info: '#3182CE',
  warning: '#DD6B20',
  success: '#38A169',
  error: '#E53E3E',
};

export const Alert = styled('div', (props: AlertProps) => ({
  padding: '1rem',
  borderRadius: '0.375rem',
  backgroundColor: props.status
    ? `${alertColors[props.status]}20`
    : '#3182CE20',
  border: '1px solid',
  borderColor: props.status ? alertColors[props.status] : '#3182CE',
  color: props.status ? alertColors[props.status] : '#3182CE',
}));

export const AlertTitle = styled('div', {
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});

export const AlertDescription = styled('div', {
  fontSize: '0.875rem',
});

// Avatar
interface AvatarProps {
  size?: string;
  name?: string;
  src?: string;
  borderRadius?: string;
}

export const Avatar = styled('div', (props: AvatarProps) => ({
  alignItems: 'center',
  backgroundColor: '#e2e8f0',
  borderRadius: props.borderRadius || '50%',
  display: 'inline-flex',
  height: props.size || '2.5rem',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  width: props.size || '2.5rem',

  '&::before': {
    content: props.name?.charAt(0)?.toUpperCase(),
    color: '#4A5568',
    fontSize: `calc(${props.size || '2.5rem'} / 2.5)`,
  },
}));

// Badge
interface BadgeProps {
  variant?: 'solid' | 'subtle' | 'outline';
  colorScheme?: string;
}

const badgeVariants = {
  solid: {
    background: '#3182CE',
    color: 'white',
  },
  subtle: {
    background: '#3182CE20',
    color: '#3182CE',
  },
  outline: {
    background: 'transparent',
    border: '1px solid #3182CE',
    color: '#3182CE',
  },
};

export const Badge = styled('span', (props: BadgeProps) => ({
  alignItems: 'center',
  display: 'inline-flex',
  padding: '0.125rem 0.5rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.2,
  ...badgeVariants[props.variant || 'solid'],
}));

// Button
interface ButtonProps {
  color?: string;
  variant?: 'solid' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  mx?: string | number;
  ml?: string | number;
  mr?: string | number;
  mt?: string | number;
  mb?: string | number;
  my?: string | number;
  m?: string | number;
  rightIcon?: ReactNode;
  onClick?: () => void;
}

export const Button = styled('button', (props: ButtonProps) => {
  const variant = props.variant || 'solid';
  const size = props.size || 'md';
  return {
    backgroundColor:
      variant === 'ghost'
        ? 'none'
        : variant === 'outline'
        ? 'white'
        : 'var(--cocoso-colors-theme-500)',
    borderRadius: 'var(--cocoso-border-radius)',
    borderStyle: 'solid',
    borderWidth: variant === 'ghost' ? '0' : '2px',
    borderColor: props.color || 'var(--cocoso-colors-theme-500)',
    color:
      variant === 'solid' ? 'white' : 'var(--cocoso-colors-theme-500)',
    cursor: 'pointer',
    fontSize:
      size === 'xs'
        ? '0.75rem'
        : size === 'sm'
        ? '0.875rem'
        : size === 'lg'
        ? '1.125rem'
        : '1rem',
    fontWeight: 'bold',
    marginInline: xToRem(props.mx),
    marginInlineStart: xToRem(props.ml),
    marginInlineEnd: xToRem(props.mr),
    marginTop: xToRem(props.mt || props.my),
    marginBottom: xToRem(props.mb || props.my),
    margin: xToRem(props.m),
    paddingInline:
      variant === 'ghost'
        ? '0.75rem'
        : size === 'xs'
        ? '0.65rem'
        : size === 'sm'
        ? '0.85rem'
        : size === 'lg'
        ? '1.15rem'
        : '1rem',
    paddingTop:
      variant === 'ghost'
        ? '0.20rem'
        : size === 'xs'
        ? '0.35rem'
        : size === 'sm'
        ? '0.35rem'
        : size === 'lg'
        ? '0.55rem'
        : '0.45rem',
    paddingBottom:
      variant === 'ghost'
        ? '0.20rem'
        : size === 'xs'
        ? '0.35rem'
        : size === 'sm'
        ? '0.35rem'
        : size === 'lg'
        ? '0.55rem'
        : '0.45rem',
    ':hover': {
      backgroundColor:
        variant === 'solid'
          ? 'var(--cocoso-colors-theme-600)'
          : 'var(--cocoso-colors-theme-50)',
    },
    ':focus': {
      backgroundColor:
        variant === 'solid'
          ? 'var(--cocoso-colors-theme-700)'
          : 'var(--cocoso-colors-theme-100)',
    },
  };
});

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
}

const IconButtonComponent = styled(
  Button,
  (props: IconButtonProps) => ({
    padding: '0.3rem',
  })
);

export const IconButton = (props: IconButtonProps) => {
  return (
    <IconButtonComponent {...props}>{props.icon}</IconButtonComponent>
  );
};

//Checkbox
export { Checkbox };

// Container
interface ContainerProps {
  maxW?: string;
  px?: string | number;
}

export const Container = styled(Box, (props: ContainerProps) => ({
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: props.maxW || '60rem',
  paddingLeft: props.px ? getSpacing(props.px) : '1rem',
  paddingRight: props.px ? getSpacing(props.px) : '1rem',
  width: '100%',
}));

// Divider
export const Divider = styled('hr', {
  border: 'none',
  borderTop: '1px solid #b3b3b3',
  margin: '1rem auto',
  maxWidth: '980px',
  padding: '0 1rem',
  width: '100%',
});

// Flex
export const Flex = styled('div', (props: any) => ({
  alignItems: props.align || props.alignItems || 'flex-start',
  display: 'flex',
  gap: props.gap || '1rem',
  // flexDirection: props.direction || props.flexDirection || 'row',
  flexWrap: props.wrap || props.flexWrap || 'wrap',
  justifyContent: props.justify || props.justifyContent || 'flex-start',
  ...getPropStyles(props),
}));

// Center
export const Center = styled('div', (props: any) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  ...getPropStyles(props),
}));

// Grid
interface GridProps {
  columns?: string;
  gap?: string | number;
}

export const Grid = styled('div', (props: GridProps) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: props.gap ? getSpacing(props.gap) : '1rem',
}));

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

// Image
export const Image = styled('img', (props: any) => ({
  height: 'auto',
  objectFit: props.objectFit || 'cover',
  // width: '100%',
}));

// Input
export const Input = styled('input', (props: any) => ({
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '0.25rem',
}));

// Link
export const Link = styled('a', (props: any) => ({
  color: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
}));

// Stack, HStack, VStack, Wrap
export const Stack = styled(Flex, {});

export const HStack = styled(Flex, {});

export const VStack = styled(Flex, {
  flexDirection: 'column',
});

export const Wrap = styled(Flex, {});

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
  // fontWeight: 'bold',
  padding: '0.25rem 0.5rem',
}));

// Text
// interface TextProps {
//   fontSize?: string;
//   size?: string;
//   fontWeight?: string;
//   color?: string;
//   lineHeight?: string;
//   textAlign?: string;
// }

export const Text = styled('p', (props: any) => {
  const color = props.color?.split('.');
  const fontSize = props.size || props.fontSize;

  return {
    color: color
      ? `var(--chakra-colors-${color[0]}-${color[1]})`
      : 'gray.900',
    fontSize: fontSize
      ? fontSizes[fontSize as keyof typeof fontSizes]
      : fontSizes.md,
    fontWeight: props.fontWeight || 'normal',
    paddingInlineStart: xToRem(props.pl),
    paddingInlineEnd: xToRem(props.pr),
    paddingInline: xToRem(props.px),
    paddingTop: xToRem(props.pt || props.py),
    paddingBottom: xToRem(props.pb || props.py),
    padding: xToRem(props.p),
    marginInline: xToRem(props.mx),
    marginInlineStart: xToRem(props.ml),
    marginInlineEnd: xToRem(props.mr),
    marginTop: xToRem(props.mt || props.my),
    marginBottom: xToRem(props.mb || props.my),
    margin: xToRem(props.m),
  };
});

export const Code = styled(Text, {
  fontFamily: 'monospace',
});
