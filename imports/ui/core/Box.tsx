import React from 'react';
import { styled } from 'restyle';

import { getPropStyles, getSpacing } from '/imports/ui/core/functions';

// Minimal Chakra-like Box
export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  style?: React.CSSProperties;
};

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as: Component = 'div', style, ...rest }, ref) => {
    return <Component ref={ref} style={style} {...rest} />;
  }
);

// Center
export const Center = styled('div', (props: any) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  ...getPropStyles(props),
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
export const Flex = styled('div', (props: any) => ({
  alignItems: props.align || props.alignItems || 'flex-start',
  display: 'flex',
  gap: props.gap || '0.5rem',
  // flexDirection: props.direction || props.flexDirection || 'row',
  flexWrap: props.wrap || props.flexWrap || 'nowrap',
  justifyContent: props.justify || props.justifyContent || 'flex-start',
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

// Divider
export const Divider = styled('hr', {
  border: 'none',
  borderTop: '1px solid #b3b3b3',
  margin: '1rem auto',
  maxWidth: '980px',
  padding: '0 1rem',
  width: '100%',
});

// Stack, HStack, VStack, Wrap
export const Stack = styled(Flex, {});

export const HStack = styled(Flex, {});

export const VStack = styled(Flex, {
  flexDirection: 'column',
});

export const Wrap = (props: any) => {
  return <Flex flexWrap="wrap" {...props} />;
};
