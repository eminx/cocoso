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
export const Box = ({ css, children, ...props }: any) => (
  <BaseDiv
    css={{ ...css, display: 'block', ...getPropStyles(props) }}
    {...props}
  >
    {children}
  </BaseDiv>
);

// Center
export const Center = ({ css, children, ...props }: any) => (
  <BaseDiv
    css={{
      ...css,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: props.w || props.width || '100%',
      ...getPropStyles(props),
    }}
    {...props}
  >
    {children}
  </BaseDiv>
);

// Container
interface ContainerProps {
  maxW?: string;
  px?: string | number;
}

export const Container = ({
  css,
  children,
  ...props
}: ContainerProps & any) => (
  <Box
    css={{
      ...css,
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: props.maxW || '60rem',
      paddingLeft: props.px ? getSpacing(props.px) : '1rem',
      paddingRight: props.px ? getSpacing(props.px) : '1rem',
      width: '100%',
      ...getPropStyles(props),
    }}
    {...props}
  >
    {children}
  </Box>
);

// Flex
export const Flex = ({ css, children, ...props }: any) => (
  <BaseDiv
    css={{
      ...css,
      alignItems: props.align || props.alignItems || 'flex-start',
      display: 'flex',
      gap: props.gap || props.spacing || '0.5rem',
      flexDirection: props.direction || props.flexDirection || 'row',
      flexWrap: props.wrap || 'nowrap',
      justifyContent: props.justify || props.justifyContent || 'flex-start',
      ...getPropStyles(props),
    }}
    {...props}
  >
    {children}
  </BaseDiv>
);

export const FormControl = ({ css, children, ...props }: any) => (
  <Flex {...props}>{children}</Flex>
);

export const FormLabel = ({ css, children, ...props }: any) => (
  <BaseLabel
    css={{
      ...css,
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      ...getPropStyles(props),
    }}
    {...props}
  >
    {children}
  </BaseLabel>
);

// Grid
interface GridProps {
  templateColumns?: string;
  gridTemplateColumns?: string;
  gap?: string | number;
}

export const Grid = ({ css, children, ...props }: GridProps & any) => (
  <BaseDiv
    css={{
      ...css,
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
  >
    {children}
  </BaseDiv>
);

// Divider
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: string;
  margin?: string;
}

export const Divider = ({ css, ...props }: DividerProps & any) => {
  const vertical = props.orientation === 'vertical';

  return (
    <BaseHr
      css={{
        ...css,
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

export const List = ({ css, children, ...props }: any) => (
  <BaseUl
    css={{ ...css, listStyleType: 'none', padding: 0, ...getPropStyles(props) }}
    {...props}
  >
    {children}
  </BaseUl>
);

export const ListItem = ({ css, children, ...props }: any) => (
  <BaseLi
    css={{ ...css, marginBottom: '0.5rem', ...css, ...getPropStyles(props) }}
    {...props}
  >
    {children}
  </BaseLi>
);

// Stack, HStack, VStack, Wrap
export const Stack = ({ children, ...props }: any) => (
  <Flex {...props}>{children}</Flex>
);

export const HStack = ({ children, ...props }: any) => (
  <Flex flexDirection="row" {...props}>
    {children}
  </Flex>
);

export const VStack = ({ children, ...props }: any) => (
  <Flex flexDirection="column" {...props}>
    {children}
  </Flex>
);

export const Wrap = ({ children, ...props }: any) => (
  <Flex flexWrap="wrap" {...props}>
    {children}
  </Flex>
);
