import React from 'react';

import { Box, Heading } from '/imports/ui/core';

export default function AdminBodyWrapper({
  title,
  description,
  children,
}: {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box>
      {title && <Heading>{title}</Heading>}
      {description && (
        <Heading css={{ fontWeight: '300' }} size="sm">
          {description}
        </Heading>
      )}

      {children}
    </Box>
  );
}
