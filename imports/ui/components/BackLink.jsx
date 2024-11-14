import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons/dist/ChevronLeft';

export default function BackLink({ backLink, isSmall = false }) {
  if (!backLink) {
    return null;
  }

  const link = backLink.value === '/info' ? '/pages' : backLink.value;

  return (
    <Link to={link}>
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
