import React from 'react';

import { Box } from '/imports/ui/core';

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
      <Box color="gray.800" mb="1" css={{ fontWeight: 'bold' }}>
        {label}
        {required && (
          <span style={{ color: 'var(--cocoso-colors-red-500)' }}>
            {' '}
            *
          </span>
        )}
      </Box>
      {helperText && (
        <Box color="gray.600" mb="2" css={{ fontSize: '0.875rem' }}>
          {helperText}
        </Box>
      )}
      {children}
      {errorMessage && (
        <Box css={{ color: 'var(--cocoso-colors-red-500)' }}>
          {errorMessage}
        </Box>
      )}
    </Box>
  );
}
