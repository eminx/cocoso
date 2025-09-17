import React from 'react';
import { styled, xToRem } from '/stitches.config';
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
    css={{ display: 'block', ...getPropStyles(props), ...css }}
    {...props}
  >
    {children}
  </BaseDiv>
);

// Center
export const Center = ({ css, children, ...props }: any) => (
  <BaseDiv
    css={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: props.w || props.width || '100%',
      ...getPropStyles(props),
      ...css,
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
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: props.maxW || '60rem',
      paddingLeft: props.px ? getSpacing(props.px) : '1rem',
      paddingRight: props.px ? getSpacing(props.px) : '1rem',
      width: '100%',
      ...getPropStyles(props),
      ...css,
    }}
    {...props}
  >
    {children}
  </Box>
);

// Flex
export const Flex = ({
  align,
  alignItems,
  css,
  direction,
  gap,
  justify,
  wrap,
  children,
  ...rest
}: any) => (
  <BaseDiv
    css={{
      alignItems: align || alignItems || 'flex-start',
      display: 'flex',
      flexDirection: direction || 'row',
      flexWrap: wrap || 'nowrap',
      gap: xToRem(gap) || '0.5rem',
      justifyContent: justify || 'flex-start',
      ...getPropStyles(rest),
      ...css,
    }}
    {...rest}
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
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      ...getPropStyles(props),
      ...css,
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
      display: 'grid',
      gap: props.gap ? getSpacing(props.gap) : '1rem',
      gridTemplateColumns:
        props.templateColumns ||
        props.gridTemplateColumns ||
        'repeat(auto-fit, minmax(200px, 1fr))',
      width: '100%',
      ...getPropStyles(props),
      ...css,
    }}
    // {...props}
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
        alignSelf: vertical ? 'stretch' : 'auto',
        border: 'none',
        backgroundColor: props.color || 'var(--cocoso-colors-gray-300)',
        height: vertical ? 'auto' : props.thickness || '1px',
        margin: props.margin || (vertical ? '0 0.5rem' : '0.5rem auto'),
        maxWidth: vertical ? 'none' : '980px',
        minHeight: vertical ? '1rem' : 'auto',
        padding: '0',
        width: vertical ? props.thickness || '1px' : '100%',
        ...css,
      }}
      {...props}
    />
  );
};

export const List = ({ css, children, ...props }: any) => (
  <BaseUl
    css={{ listStyleType: 'none', padding: 0, ...getPropStyles(props), ...css }}
    {...props}
  >
    {children}
  </BaseUl>
);

export const ListItem = ({ css, children, ...props }: any) => (
  <BaseLi
    css={{ marginBottom: '0.5rem', ...getPropStyles(props), ...css }}
    {...props}
  >
    {children}
  </BaseLi>
);
