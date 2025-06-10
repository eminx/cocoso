import React, { ReactNode } from 'react';
import { styled } from 'restyle';

// Shorthands
type ShorthandProps = {
  [key: string]: string;
};

const shorthandProps: ShorthandProps = {
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: 'paddingInline',
  py: 'paddingBlock',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: 'marginInline',
  my: 'marginBlock',
  bg: 'backgroundColor',
  maxW: 'maxWidth',
  maxH: 'maxHeight',
  w: 'width',
  h: 'height',
  pos: 'position',
  d: 'display',
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left',
  z: 'zIndex',
};

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
  if (Number(value)) {
    return spaceScale[value as keyof typeof spaceScale];
  }
  return spaceScale[0];
};

const transformProps = (props: any) => {
  const transformedProps = { ...props };
  Object.keys(props).forEach((key) => {
    if (shorthandProps[key]) {
      const value = getSpacing(props[key]);
      transformedProps[shorthandProps[key]] = value;
      delete transformedProps[key];
    }
  });
  return transformedProps;
};

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

// Box
export const Box = styled('div', (props: any) => ({
  display: 'flex',
  flexDirection: 'column',
  // ...transformProps(props),
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
  variant?: string;
  size?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
}

export const Button = styled('button', (props: ButtonProps) => ({
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  borderRadius: '0.25rem',
  // ...transformProps(props),
}));

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

// Flex
export const Flex = styled(Box, (props: any) => ({
  align: props.align || 'flex-start',
  alignItems: props.alignItems || 'flex-start',
  direction: props.direction || 'row',
  flexDirection: props.flexDirection || 'row',
  flexWrap: props.wrap || props.flexWrap || 'wrap',
  justifyContent: props.justify || props.justifyContent || 'flex-start',
  wrap: props.wrap || 'wrap',
}));

// Center
export const Center = styled(Flex, {
  alignItems: 'center',
  justifyContent: 'center',
});

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
    // ...transformProps(props),
  };
});

// Image
export const Image = styled('img', (props: any) => ({
  height: 'auto',
  objectFit: props.objectFit || 'cover',
  width: '100%',
  ...transformProps(props),
}));

// Input
export const Input = styled('input', (props: any) => ({
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '0.25rem',
  // ...transformProps(props),
}));

// Link
export const Link = styled('a', (props: any) => ({
  color: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
  // ...transformProps(props),
}));

// Menu
interface MenuProps {
  isOpen?: boolean;
}

export const Menu = styled('div', {
  display: 'inline-block',
  position: 'relative',
});

export const MenuButton = styled(Button, {
  display: 'inline-flex',
});

export const MenuList = styled('div', (props: MenuProps) => ({
  backgroundColor: 'white',
  borderRadius: '0.375rem',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  display: props.isOpen ? 'block' : 'none',
  marginTop: '0.25rem',
  minWidth: '200px',
  padding: '0.5rem 0',
  position: 'absolute',
  right: '0',
  top: '100%',
  zIndex: 1000,
}));

export const MenuItem = styled(Button, {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  textAlign: 'left',
  width: '100%',
  '&:hover': {
    backgroundColor: '#edf2f7',
  },
});

// Stack, HStack, VStack, Wrap
export const Stack = styled(Flex, (props: any) => ({
  flexDirection: props.direction || 'column',
  gap: props.spacing ? getSpacing(props.spacing) : '0.5rem',
}));

export const HStack = styled(Stack, {
  flexDirection: 'row',
});

export const VStack = styled(Stack, {
  flexDirection: 'column',
});

export const Wrap = styled(Stack, {
  flexWrap: 'wrap',
});

// Text
interface TextProps {
  fontSize?: string;
  size?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  textAlign?: string;
}

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

export const Text = styled('p', (props: TextProps) => {
  const color = props.color?.split('.');
  return {
    color: color
      ? `var(--chakra-colors-${color[0]}-${color[1]})`
      : 'gray.900',
    fontSize: props.size
      ? fontSizes[props.size as keyof typeof fontSizes]
      : fontSizes.md,
    // ...transformProps(props),
  };
});

// export const Modal = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.4);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// `;

// export const ModalContent = styled.div`
//   background: white;
//   padding: 2rem;
//   border-radius: 0.5rem;
//   max-width: 500px;
//   width: 90%;
//   position: relative;
// `;

// export const ModalCloseButton = styled.button`
//   position: absolute;
//   top: 0.75rem;
//   right: 0.75rem;
//   background: none;
//   border: none;
//   cursor: pointer;
// `;

// interface AccordionProps {
//   isOpen?: boolean;
// }

// export const Accordion = styled.div`
//   width: 100%;
//   border: 1px solid #e2e8f0;
//   border-radius: 0.375rem;
// `;

// export const AccordionButton = styled.button`
//   width: 100%;
//   padding: 1rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   background: none;
//   border: none;
//   cursor: pointer;

//   &:hover {
//     background-color: #f7fafc;
//   }
// `;

// export const AccordionPanel = styled.div<AccordionProps>`
//   padding: ${(props) => (props.isOpen ? '1rem' : '0')};
//   height: ${(props) => (props.isOpen ? 'auto' : '0')};
//   overflow: hidden;
//   transition: all 0.2s ease-in-out;
// `;
