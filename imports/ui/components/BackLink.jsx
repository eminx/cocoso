import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons/dist/ChevronLeft';

export default function BackLink({ backLink, isSmall = false }) {
  if (!backLink) {
    return null;
  }
  return (
    <Link to={backLink?.value}>
      <Button
        as="span"
        leftIcon={<ChevronLeftIcon mr="-2" fontSize="xl" />}
        size={isSmall ? 'sm' : 'md'}
        variant="link"
      >
        {backLink?.label}
      </Button>
    </Link>
  );
}
