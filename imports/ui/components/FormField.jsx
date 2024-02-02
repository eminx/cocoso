import React from 'react';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';

function FormField({ children, errorMessage, helperText, label, size = 'sm', ...otherProps }) {
  return (
    <FormControl my="4" {...otherProps}>
      <FormLabel fontWeight="bold" requiredIndicator={'*'}>
        {label}
      </FormLabel>
      {helperText && (
        <FormHelperText color="gray.900" mb="3">
          {helperText}
        </FormHelperText>
      )}
      {children}
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
}

export default FormField;
