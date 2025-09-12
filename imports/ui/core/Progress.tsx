import React from 'react';
import { styled } from '@stitches/react';

interface ProgressProps {
  value: number; // 0-100
  height?: string;
  style?: React.CSSProperties;
}

const Track = styled('div', {
  width: '100%',
  background: 'linear-gradient(90deg, hsl(0, 70%, 90%), hsl(200, 70%, 90%))',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  height: '12px', // Thicker than Loader
});

const BarStyled = styled('div', {
  height: '100%',
  background:
    'linear-gradient(90deg, hsl(0, 70%, 60%), hsl(36, 70%, 60%), hsl(72, 70%, 60%), hsl(108, 70%, 60%), hsl(144, 70%, 60%), hsl(180, 70%, 60%), hsl(216, 70%, 60%), hsl(252, 70%, 60%), hsl(288, 70%, 60%), hsl(324, 70%, 60%), hsl(360, 70%, 60%))',
  backgroundSize: '200% 100%',
  animation: 'rainbow-slide 2s linear infinite',
  transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
});

const Bar = (props: { value: number }) => (
  <BarStyled
    css={{
      width: `${props.value}%`,
    }}
  />
);

const Progress: React.FC<ProgressProps> = ({
  value,
  height = '12px',
  style,
}) => (
  <Track style={{ height, ...style }}>
    <Bar value={Math.max(0, Math.min(100, value))} />
  </Track>
);

export default Progress;
