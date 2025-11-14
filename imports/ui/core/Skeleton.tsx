import React from 'react';
import { styled } from '/stitches.config';

interface SkeletonProps {
  isEntry?: boolean;
  count?: number;
  css?: any;
}

const SkeletonItem = styled('div', {
  backgroundColor: 'var(--cocoso-colors-theme-800)',
  borderRadius: 'var(--cocoso-border-radius)',
  width: '100%',
  height: '200px',
  animation: 'pulse 1.5s ease-in-out infinite',
});

const SkeletonEntry = styled('div', {
  backgroundColor: 'var(--cocoso-colors-theme-800)',
  borderRadius: 'var(--cocoso-border-radius)',
  width: '100%',
  height: '300px',
  animation: 'pulse 1.5s ease-in-out infinite',
});

const SkeletonGrid = styled('div', {
  display: 'grid',
  gap: '1rem',
  width: '100%',
  gridTemplateColumns: '1fr',
  '@media (min-width: 720px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1280px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
});

const Skeleton: React.FC<SkeletonProps> = ({
  isEntry = false,
  count = 4,
  css,
  ...props
}) => {
  if (isEntry) {
    return (
      <div style={{ padding: '1rem' }}>
        <SkeletonEntry css={css} {...props} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <SkeletonGrid css={css} {...props}>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonItem key={index} />
        ))}
      </SkeletonGrid>
    </div>
  );
};

export default Skeleton;
