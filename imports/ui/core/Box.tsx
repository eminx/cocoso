import React from 'react';
import { styled } from 'restyle';

import { getPropStyles, getSpacing } from '/imports/ui/core/functions';

// Box
export const Box = styled('div', (props: any) => ({
  display: 'block',
  ...getPropStyles(props),
}));

// Center
export const Center = styled('div', (props: any) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  width: props.width || '100%',
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
  gap: props.gap || props.spaceing || '0.5rem',
  flexDirection: props.direction || props.flexDirection || 'row',
  flexWrap: props.wrap || props.flexWrap || 'nowrap',
  justifyContent: props.justify || props.justifyContent || 'flex-start',
  ...getPropStyles(props),
}));

export const FormControl = (props: any) => <Flex {...props} />;

export const FormLabel = styled('label', (props: any) => ({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  ...getPropStyles(props),
}));

// Grid
interface GridProps {
  templateColumns?: string;
  gridTemplateColumns?: string;
  gap?: string | number;
}

export const Grid = styled('div', (props: GridProps) => ({
  display: 'grid',
  gridTemplateColumns:
    props.templateColumns ||
    props.gridTemplateColumns ||
    'repeat(auto-fit, minmax(200px, 1fr))',
  gap: props.gap ? getSpacing(props.gap) : '1rem',
  width: '100%',
}));

// Divider
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: string;
  margin?: string;
}

export const Divider = styled('hr', (props: DividerProps) => {
  const vertical = props.orientation === 'vertical';

  return {
    border: 'none',
    backgroundColor: props.color || 'var(--cocoso-colors-gray-300)',
    margin: props.margin || (vertical ? '0 0.5rem' : '0.5rem auto'),
    maxWidth: vertical ? 'none' : '980px',
    padding: '0',
    width: vertical ? props.thickness || '1px' : '100%',
    height: vertical ? 'auto' : props.thickness || '1px',
    minHeight: vertical ? '1rem' : 'auto',
    alignSelf: vertical ? 'stretch' : 'auto',
  };
});

export const List = styled('ul', (props: any) => ({
  listStyleType: 'none',
  padding: '0',
  ...getPropStyles(props),
}));

export const ListItem = styled('li', (props: any) => ({
  marginBottom: '0.5rem',
  ...getPropStyles(props),
}));

// Stack, HStack, VStack, Wrap
export const Stack = styled(Flex, {});

export const HStack = (props: any) => <Flex flexDirection="row" {...props} />;

export const VStack = (props: any) => (
  <Flex flexDirection="column" {...props} />
);

export const Wrap = (props: any) => <Flex flexWrap="wrap" {...props} />;
