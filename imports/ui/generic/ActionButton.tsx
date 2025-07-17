import React from 'react';
import { Button } from '/imports/ui/core';
import useMediaQuery from '/imports/api/_utils/useMediaQuery';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
}

export default function ActionButton({ label, onClick }: ActionButtonProps) {
  const isDesktop = useMediaQuery('(min-width: 960px)');

  return (
    <Button
      css={{
        borderColor: 'brand.100',
        borderWidth: '2px',
        colorScheme: 'brand',
        height: '48px',
        size: isDesktop ? 'lg' : 'md',
        width: isDesktop ? '240px' : '180px',
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
