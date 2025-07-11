import { styled } from 'restyle';

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

const Badge = styled('span', (props: BadgeProps) => ({
  alignItems: 'center',
  display: 'inline-flex',
  padding: '0.125rem 0.5rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.2,
  ...badgeVariants[props.variant || 'solid'],
}));

export default Badge;
