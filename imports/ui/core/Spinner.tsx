import React from 'react';
import { styled } from 'restyle';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: string;
  speed?: string;
  emptyColor?: string;
}

const sizeMap = {
  xs: '0.75rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
};

const StyledSpinner = styled('div', (props: SpinnerProps) => {
  const size = sizeMap[props.size || 'md'];
  const thickness = props.thickness || '2px';
  const speed = props.speed || '0.65s';
  const color = props.color || 'currentColor';
  const emptyColor = props.emptyColor || 'transparent';

  return {
    display: 'inline-block',
    width: size,
    height: size,
    border: `${thickness} solid ${emptyColor}`,
    borderTop: `${thickness} solid ${color}`,
    borderRadius: '50%',
    animation: `spin ${speed} linear infinite`,
  };
});

export const Spinner = (props: SpinnerProps) => {
  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <StyledSpinner {...props} />
    </>
  );
};

export default Spinner;
