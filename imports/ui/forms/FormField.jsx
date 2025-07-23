import React from 'react';

import { Box, Text } from '/imports/ui/core';

export default function FormField(props) {
  const {
    children,
    errorMessage = null,
    helperText,
    label,
    required = false,
    ...otherProps
  } = props;
  return (
    <Box my="4" w="100%" {...otherProps}>
      <Box mb="1">
        <Text color="gray.800" fontWeight="bold">
          {label}
          {required && ' *'}
        </Text>
      </Box>
      {helperText && (
        <Box mb="1">
          <Text color="gray.600" fontSize="sm">
            {helperText}
          </Text>
        </Box>
      )}
      {children}
      {errorMessage && (
        <Box mt="1">
          <Text color="red.500">{errorMessage}</Text>
        </Box>
      )}
    </Box>
  );
}
