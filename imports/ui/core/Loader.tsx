import React from 'react';
import { GlobalStyles, styled } from 'restyle';

interface LoaderProps {
  relative?: boolean;
  speed?: number; // Animation speed in seconds
}

// Simple animated loader bar
const LoaderBar = styled('div', (props: LoaderProps) => ({
  position: props.relative ? 'relative' : 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  zIndex: 1500,
  background:
    'linear-gradient(90deg, hsl(0, 70%, 60%), hsl(18, 70%, 60%), hsl(36, 70%, 60%), hsl(54, 70%, 60%), hsl(72, 70%, 60%), hsl(90, 70%, 60%), hsl(108, 70%, 60%), hsl(126, 70%, 60%), hsl(144, 70%, 60%), hsl(162, 70%, 60%), hsl(180, 70%, 60%), hsl(198, 70%, 60%), hsl(216, 70%, 60%), hsl(234, 70%, 60%), hsl(252, 70%, 60%), hsl(270, 70%, 60%), hsl(288, 70%, 60%), hsl(306, 70%, 60%), hsl(324, 70%, 60%), hsl(342, 70%, 60%), hsl(360, 70%, 60%))',
  backgroundSize: '200% 100%',
  animation: `rainbow-slide ${props.speed || 2}s linear infinite`,
}));

const Loader: React.FC<LoaderProps> = ({
  relative = false,
  speed = 2,
  ...props
}) => {
  return (
    <>
      <GlobalStyles>
        {{
          '@keyframes rainbow-slide': {
            '0%': {
              backgroundPosition: '200% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}
      </GlobalStyles>
      <LoaderBar relative={relative} speed={speed} {...props} />
    </>
  );
};

export default Loader;
