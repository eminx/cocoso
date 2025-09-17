import React from 'react';
import { styled } from '/stitches.config';

interface LoaderProps {
  relative?: boolean;
  speed?: number; // Animation speed in seconds
}

// Simple animated loader bar
const StyledLoader = styled('div', {
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  zIndex: 1500,
  background:
    'linear-gradient(90deg, hsl(0, 70%, 60%), hsl(18, 70%, 60%), hsl(36, 70%, 60%), hsl(54, 70%, 60%), hsl(72, 70%, 60%), hsl(90, 70%, 60%), hsl(108, 70%, 60%), hsl(126, 70%, 60%), hsl(144, 70%, 60%), hsl(162, 70%, 60%), hsl(180, 70%, 60%), hsl(198, 70%, 60%), hsl(216, 70%, 60%), hsl(234, 70%, 60%), hsl(252, 70%, 60%), hsl(270, 70%, 60%), hsl(288, 70%, 60%), hsl(306, 70%, 60%), hsl(324, 70%, 60%), hsl(342, 70%, 60%), hsl(360, 70%, 60%))',
  backgroundSize: '200% 100%',
});

const LoaderBar = ({ relative, speed, ...rest }: LoaderProps) => (
  <StyledLoader
    css={{
      position: relative ? 'relative' : 'fixed',
      animation: `rainbow-slide ${speed || 2}s linear infinite`,
    }}
    {...rest}
  />
);

const Loader: React.FC<LoaderProps> = ({
  relative = false,
  speed = 2,
  ...props
}) => {
  return <LoaderBar relative={relative} speed={speed} {...props} />;
};

export default Loader;
