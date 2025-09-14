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
    <Button size={isDesktop ? 'lg' : 'md'} onClick={onClick}>
      {label}
    </Button>
  );
}
