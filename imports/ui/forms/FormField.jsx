import React from 'react';

import { Box, Text } from '/imports/ui/core';

export default function FormField(props) {
  const {
    children,
    errorMessage = null,
    helper,
    label,
    required = false,
    ...otherProps
  } = props;
  return (
    <Box my="4" w="100%" {...otherProps}>
      <Box>
        <Text color="gray.800" fontWeight="bold">
          {label}
          {required && ' *'}
        </Text>
      </Box>
      {helper && (
        <Box>
          <Text color="gray.600" fontSize="sm">
            {helper}
          </Text>
        </Box>
      )}

      <Box pt="2">{children}</Box>

      {errorMessage && (
        <Box mt="1">
          <Text color="red.500">{errorMessage}</Text>
        </Box>
      )}
    </Box>
  );
}
