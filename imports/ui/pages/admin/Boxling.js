import React from 'react';

import { Box, Flex, Text } from '/imports/ui/core';

export function BoxlingColumn({ title, children }) {
  return (
    <Flex align="center" flexDirection="column">
      <Text fontWeight="bold" mb="2" size="sm">
        {title}
      </Text>

      {children}
    </Flex>
  );
}

export default function Boxling({ children, ...otherProps }) {
  return (
    <Box
      bg="blueGray.50"
      p="6"
      css={{
        borderRadius: 20,
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
