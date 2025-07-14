import React from 'react';
import { styled } from 'restyle';

const badgeBase = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '999px',
  fontWeight: 500,
  lineHeight: 1.2,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  transition: 'background 0.2s, color 0.2s, border 0.2s',
  fontFamily: 'inherit',
};

const sizeStyles = {
  sm: { fontSize: '0.75rem', padding: '0.125rem 0.5rem' },
  md: { fontSize: '0.875rem', padding: '0.1875rem 0.75rem' },
  lg: { fontSize: '1rem', padding: '0.25rem 1rem' },
};

const colorSchemes = {
  red: {
    solid: { background: '#EF4444', color: 'white', border: 'none' },
    subtle: { background: '#FEE2E2', color: '#B91C1C', border: 'none' },
    outline: {
      background: 'transparent',
      color: '#B91C1C',
      border: '1px solid #EF4444',
    },
  },
  green: {
    solid: { background: '#22C55E', color: 'white', border: 'none' },
    subtle: { background: '#DCFCE7', color: '#15803D', border: 'none' },
    outline: {
      background: 'transparent',
      color: '#15803D',
      border: '1px solid #22C55E',
    },
  },
  blue: {
    solid: { background: '#707EAE', color: 'white', border: 'none' },
    subtle: { background: '#EEF4FD', color: '#1B2559', border: 'none' },
    outline: {
      background: 'transparent',
      color: '#1B2559',
      border: '1px solid #707EAE',
    },
  },
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: keyof typeof colorSchemes;
  variant?: 'solid' | 'subtle' | 'outline';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const StyledBadge = styled('span', (props: BadgeProps) => {
  const {
    size = 'md',
    colorScheme = 'red',
    variant = 'solid',
    style,
  } = props;
  const colorSet = colorSchemes[colorScheme] || colorSchemes.red;
  return {
    ...badgeBase,
    ...(sizeStyles[size] || sizeStyles.md),
    ...(colorSet[variant] || colorSet.solid),
    ...style,
  };
});

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, ...rest }, ref) => (
    <StyledBadge ref={ref} {...rest}>
      {children}
    </StyledBadge>
  )
);
Badge.displayName = 'Badge';
export default Badge;
