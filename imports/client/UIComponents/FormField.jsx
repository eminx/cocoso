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
    <FormControl {...otherProps}>
      <FormLabel>{label}</FormLabel>
      {children}
      <FormHelperText>{helperText}</FormHelperText>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
}

export default FormField;
