import React from 'react';
import { styled } from '/stitches.config';
import { getPropStyles, getSpacing } from '/imports/ui/core/functions';

// Base primitives
const BaseDiv = styled('div', {});
const BaseLabel = styled('label', {});
const BaseHr = styled('hr', {});
const BaseUl = styled('ul', {});
const BaseLi = styled('li', {});

// Box
export const Box = (props: any) => (
  <BaseDiv css={{ display: 'block', ...getPropStyles(props) }} {...props} />
);

// Center
export const Center = (props: any) => (
  <BaseDiv
    css={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: props.w || props.width || '100%',
      ...getPropStyles(props),
    }}
    {...props}
  />
);

// Container
interface ContainerProps {
  maxW?: string;
  px?: string | number;
}

export const Container = (props: ContainerProps & any) => (
  <Box
    css={{
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: props.maxW || '60rem',
      paddingLeft: props.px ? getSpacing(props.px) : '1rem',
      paddingRight: props.px ? getSpacing(props.px) : '1rem',
      width: '100%',
      ...getPropStyles(props),
    }}
    {...props}
  />
);

// Flex
export const Flex = (props: any) => (
  <BaseDiv
    css={{
      alignItems: props.align || props.alignItems || 'flex-start',
      display: 'flex',
      gap: props.gap || props.spacing || '0.5rem',
      flexDirection: props.direction || props.flexDirection || 'row',
      flexWrap: props.wrap || props.flexWrap || 'nowrap',
      justifyContent: props.justify || props.justifyContent || 'flex-start',
      ...getPropStyles(props),
    }}
    {...props}
  />
);

export const FormControl = (props: any) => <Flex {...props} />;

export const FormLabel = (props: any) => (
  <BaseLabel
    css={{
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      ...getPropStyles(props),
    }}
    {...props}
  />
);

// Grid
interface GridProps {
  templateColumns?: string;
  gridTemplateColumns?: string;
  gap?: string | number;
}

export const Grid = (props: GridProps & any) => (
  <BaseDiv
    css={{
      display: 'grid',
      gridTemplateColumns:
        props.templateColumns ||
        props.gridTemplateColumns ||
        'repeat(auto-fit, minmax(200px, 1fr))',
      gap: props.gap ? getSpacing(props.gap) : '1rem',
      width: '100%',
      ...getPropStyles(props),
    }}
    {...props}
  />
);

// Divider
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: string;
  margin?: string;
}

export const Divider = (props: DividerProps & any) => {
  const vertical = props.orientation === 'vertical';

  return (
    <BaseHr
      css={{
        border: 'none',
        backgroundColor: props.color || 'var(--cocoso-colors-gray-300)',
        margin: props.margin || (vertical ? '0 0.5rem' : '0.5rem auto'),
        maxWidth: vertical ? 'none' : '980px',
        padding: '0',
        width: vertical ? props.thickness || '1px' : '100%',
        height: vertical ? 'auto' : props.thickness || '1px',
        minHeight: vertical ? '1rem' : 'auto',
        alignSelf: vertical ? 'stretch' : 'auto',
      }}
      {...props}
    />
  );
};

export const List = (props: any) => (
  <BaseUl
    css={{ listStyleType: 'none', padding: 0, ...getPropStyles(props) }}
    {...props}
  />
);

export const ListItem = (props: any) => (
  <BaseLi
    css={{ marginBottom: '0.5rem', ...getPropStyles(props) }}
    {...props}
  />
);

// Stack, HStack, VStack, Wrap
export const Stack = (props: any) => <Flex {...props} />;

export const HStack = (props: any) => <Flex flexDirection="row" {...props} />;

export const VStack = (props: any) => (
  <Flex flexDirection="column" {...props} />
);

export const Wrap = (props: any) => <Flex flexWrap="wrap" {...props} />;
