import { styled } from 'restyle';

// Avatar
interface AvatarProps {
  size?: string;
  name?: string;
  src?: string;
  borderRadius?: string;
}

const Avatar = styled('div', (props: AvatarProps) => ({
  alignItems: 'center',
  backgroundColor: '#e2e8f0',
  borderRadius: props.borderRadius || '50%',
  display: 'inline-flex',
  height: props.size || '2.5rem',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  width: props.size || '2.5rem',

  '&::before': {
    content: props.name?.charAt(0)?.toUpperCase(),
    color: '#4A5568',
    fontSize: `calc(${props.size || '2.5rem'} / 2.5)`,
  },
}));

export default Avatar;
