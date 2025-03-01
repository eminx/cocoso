import styled from 'styled-components';

type SpaceScale = {
  [key: number]: string;
};

type ShorthandProps = {
  [key: string]: string;
};

interface FlexProps {
  direction?: string;
  align?: string;
  justify?: string;
  wrap?: string;
  gap?: string | number;
}

interface StackProps extends FlexProps {
  spacing?: string | number;
}

interface GridProps {
  columns?: string;
  gap?: string | number;
}

interface ContainerProps {
  maxW?: string;
  px?: string | number;
}

interface AvatarProps {
  size?: string;
  name?: string;
  src?: string;
  borderRadius?: string;
}

interface MenuProps {
  isOpen?: boolean;
}

interface AccordionProps {
  isOpen?: boolean;
}

interface AlertProps {
  status?: 'info' | 'warning' | 'success' | 'error';
}

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

const getSpacing = (value: string | number): string => {
  if (Number(value)) {
    return spaceScale[value];
  }
  return value;
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

export const Box = styled.div<any>`
  display: flex;
  flex-direction: column;
  ${(props) => ({ ...transformProps(props) })}
`;

export const Flex = styled(Box)<FlexProps>`
  display: flex;
  flex-direction: row;
  ${(props) => props.direction && `flex-direction: ${props.direction}`};
  ${(props) => props.align && `align-items: ${props.align}`};
  ${(props) => props.justify && `justify-content: ${props.justify}`};
  ${(props) => props.wrap && `flex-wrap: ${props.wrap}`};
  ${(props) => props.gap && `gap: ${getSpacing(props.gap)}`};
`;

export const Stack = styled(Flex)<StackProps>`
  flex-direction: ${(props) => props.direction || 'column'};
  gap: ${(props) => (props.spacing ? getSpacing(props.spacing) : '0.5rem')};
`;

export const HStack = styled(Flex)<StackProps>`
  flex-direction: row;
  gap: ${(props) => (props.spacing ? getSpacing(props.spacing) : '0.5rem')};
`;

export const VStack = styled(Flex)<StackProps>`
  flex-direction: column;
  gap: ${(props) => (props.spacing ? getSpacing(props.spacing) : '0.5rem')};
`;

export const Wrap = styled(Flex)<StackProps>`
  flex-wrap: wrap;
  gap: ${(props) => (props.spacing ? getSpacing(props.spacing) : '0.5rem')};
`;

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

export const Text = styled.p<any>`
  font-size: ${(props) => (props.size ? fontSizes[props.size] : fontSizes.lg)};
  ${(props) => ({ ...transformProps(props) })}
`;

export const Button = styled.button<any>`
  cursor: pointer;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  ${(props) => ({ ...transformProps(props) })}
`;

export const Input = styled.input<any>`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  ${(props) => ({ ...transformProps(props) })}
`;

export const Grid = styled(Box)<GridProps>`
  display: grid;
  ${(props) => props.columns && `grid-template-columns: ${props.columns}`};
  ${(props) => props.gap && `gap: ${getSpacing(props.gap)}`};
`;

export const Container = styled(Box)<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: ${(props) => props.maxW || '60rem'};
  padding-left: ${(props) => (props.px ? getSpacing(props.px) : '1rem')};
  padding-right: ${(props) => (props.px ? getSpacing(props.px) : '1rem')};
`;

export const Image = styled.img<any>`
  max-width: 100%;
  height: auto;
  ${(props) => ({ ...transformProps(props) })}
`;

export const Link = styled.a<any>`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  ${(props) => ({ ...transformProps(props) })}
`;

export const Center = styled(Flex)`
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled.div<AvatarProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size || '2.5rem'};
  height: ${(props) => props.size || '2.5rem'};
  border-radius: ${(props) => props.borderRadius || '50%'};
  background-color: #e2e8f0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${(props) =>
    props.name &&
    !props.src &&
    `
    &::before {
      content: "${props.name.charAt(0).toUpperCase()}";
      color: #4A5568;
      font-size: calc(${props.size || '2.5rem'} / 2.5);
    }
  `}
`;

export const Menu = styled.div<MenuProps>`
  position: relative;
  display: inline-block;
`;

export const MenuButton = styled(Button)`
  // Inherit Button styles and add menu-specific styles
`;

export const MenuList = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.25rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #edf2f7;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
  position: relative;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
`;

export const Accordion = styled.div`
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
`;

export const AccordionButton = styled.button`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f7fafc;
  }
`;

export const AccordionPanel = styled.div<AccordionProps>`
  padding: ${(props) => (props.isOpen ? '1rem' : '0')};
  height: ${(props) => (props.isOpen ? 'auto' : '0')};
  overflow: hidden;
  transition: all 0.2s ease-in-out;
`;

const alertColors = {
  info: '#3182CE',
  warning: '#DD6B20',
  success: '#38A169',
  error: '#E53E3E',
};

export const Alert = styled.div<AlertProps>`
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: ${(props) => (props.status ? `${alertColors[props.status]}20` : '#3182CE20')};
  border: 1px solid ${(props) => (props.status ? alertColors[props.status] : '#3182CE')};
  color: ${(props) => (props.status ? alertColors[props.status] : '#3182CE')};
`;

export const AlertTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const AlertDescription = styled.div`
  font-size: 0.875rem;
`;

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

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.2;
  ${(props) => props.variant && badgeVariants[props.variant]}
`;

interface HeadingProps {
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

export const Heading = styled.h2<HeadingProps>`
  font-weight: 700;
  line-height: 1.2;
  font-size: ${(props) => (props.size ? headingSizes[props.size] : headingSizes.lg)};
  ${(props) => ({ ...transformProps(props) })}
`;
