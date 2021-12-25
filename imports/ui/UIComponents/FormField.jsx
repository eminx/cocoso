import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';

function FormField({
  helperText,
  errorMessage,
  label,
  children,
  ...otherProps
}) {
  return (
    <FormControl size="sm" {...otherProps}>
      <FormLabel mb="1">{label}</FormLabel>
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
}

export default FormField;
