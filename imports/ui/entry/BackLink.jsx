import React from 'react';
import { Link } from 'react-router';
import ChevronLeftIcon from 'lucide-react/dist/esm/icons/chevron-left';

import { Button } from '/imports/ui/core';

export default function BackLink({ backLink }) {
  if (!backLink) {
    return null;
  }

  const link = backLink.value === '/info' ? '/pages' : backLink.value;

  return (
    <Link to={link}>
      <Button
        leftIcon={<ChevronLeftIcon size={18} />}
        size="lg"
        variant="ghost"
        css={{
          fontWeight: 'normal',
        }}
      >
        {backLink?.label}
      </Button>
    </Link>
  );
}
