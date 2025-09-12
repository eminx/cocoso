import React from 'react';
import { styled } from '@stitches/react';

import { Flex } from './Box';

// Avatar props interface
export interface AvatarProps {
  borderRadius?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  src?: string;
  children?: React.ReactNode; // for badge or status
}

// Size mapping
const sizeMap = {
  xs: '1.5rem',
  sm: '2.5rem',
  md: '3.5rem',
  lg: '4.5rem',
  xl: '5.5rem',
  '2xl': '8rem',
  '4xl': '12rem',
};

// Font size mapping for initials
const fontSizeMap = {
  xs: '0.75rem',
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '4rem',
  '4xl': '8rem',
  '5xl': '12rem',
  '6xl': '16rem',
};

// Styled wrapper for positioning badge
const AvatarWrapperStyled = styled('div', {
  position: 'relative',
  display: 'inline-block',
});

const AvatarWrapper = (props: AvatarProps) => {
  const { size, ...rest } = props;
  return (
    <AvatarWrapperStyled
      css={{
        width: sizeMap[size || 'md'],
        height: sizeMap[size || 'md'],
      }}
      {...rest}
    />
  );
};

// Main avatar container
const AvatarContainerStyled = styled('div', {
  width: '100%',
  height: '100%',
  border: '2px solid white',
  overflow: 'hidden',
  backgroundColor: '#e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

const AvatarContainer = ({ borderRadius, ...rest }: AvatarProps) => (
  <AvatarContainerStyled
    css={{
      borderRadius: borderRadius || 'var(--cocoso-border-radius)',
    }}
    {...rest}
  />
);

// Avatar image
const AvatarImage = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

// Avatar initials (fallback when no image)
const AvatarInitialsStyled = styled('div', {
  color: '#4A5568',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  userSelect: 'none',
});

const AvatarInitials = ({ size, ...rest }: AvatarProps) => (
  <AvatarInitialsStyled
    css={{
      fontSize: fontSizeMap[size || 'md'],
    }}
    {...rest}
  />
);

// Badge container
const BadgeContainer = styled('div', {
  backgroundColor: 'white',
  border: '2px solid white',
  borderRadius: '50%',
  bottom: 0,
  height: '20px',
  pointerEvents: 'auto',
  position: 'absolute',
  right: 0,
  transform: 'translate(25%, 25%)',
  width: '20px',
  zIndex: 1,
});

const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  name,
  src,
  children,
  ...props
}) => {
  const initials = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <AvatarWrapper size={size}>
      <AvatarContainer size={size} {...props}>
        {src ? (
          <AvatarImage src={src} alt={name} />
        ) : (
          <AvatarInitials size={size}>{initials}</AvatarInitials>
        )}
      </AvatarContainer>
      {children && <BadgeContainer>{children}</BadgeContainer>}
    </AvatarWrapper>
  );
};

export const AvatarGroup = (props: any) => (
  <Flex
    gap={props.spacing || '-2rem'}
    css={{ paddingRight: '1rem' }}
    {...props}
  />
);

export default Avatar;
