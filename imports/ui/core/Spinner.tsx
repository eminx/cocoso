import React from 'react';
import { styled } from '/stitches.config';

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

const StyledSpinnerStyled = styled('div', {
  display: 'inline-block',
  borderRadius: '50%',
});

const StyledSpinner = (props: SpinnerProps) => {
  const size = sizeMap[props.size || 'md'];
  const thickness = props.thickness || '2px';
  const speed = props.speed || '0.65s';
  const color = props.color || 'currentColor';
  const emptyColor = props.emptyColor || 'transparent';

  return (
    <StyledSpinnerStyled
      css={{
        width: size,
        height: size,
        border: `${thickness} solid ${emptyColor}`,
        borderTop: `${thickness} solid ${color}`,
        animation: `spin ${speed} linear infinite`,
      }}
    />
  );
};

export const Spinner = (props: SpinnerProps) => {
  return <StyledSpinner {...props} />;
};

export default Spinner;
