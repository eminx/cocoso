import React from 'react';
import { Button, useMediaQuery } from '@chakra-ui/react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
}

export default function ActionButton({ label, onClick }: ActionButtonProps) {
  const [isDesktop] = useMediaQuery('(min-width: 960px)');

  return (
    <Button
      borderColor="brand.100"
      borderWidth="2px"
      colorScheme="brand"
      height="48px"
      size={isDesktop ? 'lg' : 'md'}
      width={isDesktop ? '240px' : '180px'}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
