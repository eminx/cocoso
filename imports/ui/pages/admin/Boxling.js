import React from 'react';

import { Box, Text, VStack } from '/imports/ui/core';

export function BoxlingColumn({ title, children }) {
  return (
    <VStack align="center" gap="1">
      <Text fontWeight="bold" mb="2" size="sm">
        {title}
      </Text>
      {children}
    </VStack>
  );
}

export default function Boxling({ children, ...otherProps }) {
  return (
    <Box
      bg="blueGray.50"
      p="6"
      css={{
        borderRadius: 'var(--cocoso-border-radius)',
        ':hover': {
          backgroundColor: 'white',
        },
      }}
      {...otherProps}
    >
      {children}
    </Box>
  );
}
