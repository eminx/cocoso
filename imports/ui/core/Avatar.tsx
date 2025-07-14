import React from 'react';
import { styled } from 'restyle';

// Avatar props interface
export interface AvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  name?: string;
  src?: string;
  borderRadius?: string;
  children?: React.ReactNode; // for badge or status
}

// Size mapping
const sizeMap = {
  xs: '1.5rem',
  sm: '2rem',
  md: '2.5rem',
  lg: '3rem',
  xl: '4rem',
  '2xl': '6rem',
  '4xl': '8rem',
};

// Font size mapping for initials
const fontSizeMap = {
  xs: '0.75rem',
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '4xl': '4rem',
};

// Styled wrapper for positioning badge
const AvatarWrapper = styled('div', (props: AvatarProps) => ({
  position: 'relative',
  display: 'inline-block',
  width: sizeMap[props.size || 'md'],
  height: sizeMap[props.size || 'md'],
}));

// Main avatar container
const AvatarContainer = styled('div', (props: AvatarProps) => ({
  width: '100%',
  height: '100%',
  borderRadius: props.borderRadius || '50%',
  overflow: 'hidden',
  backgroundColor: '#e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

// Avatar image
const AvatarImage = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

// Avatar initials (fallback when no image)
const AvatarInitials = styled('div', (props: AvatarProps) => ({
  color: '#4A5568',
  fontSize: fontSizeMap[props.size || 'md'],
  fontWeight: 'bold',
  textTransform: 'uppercase',
  userSelect: 'none',
}));

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
  borderRadius,
  children,
  ...props
}) => {
  const initials = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <AvatarWrapper size={size} {...props}>
      <AvatarContainer size={size} borderRadius={borderRadius}>
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

export default Avatar;
