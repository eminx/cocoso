import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';

function FormField(props) {
  const {
    children,
    errorMessage = null,
    helperText,
    label,
    ...otherProps
  } = props;
  return (
    <FormControl my="2" {...otherProps}>
      <FormLabel
        color="gray.800"
        fontWeight="bold"
        mb="1"
        requiredIndicator={'*'}
      >
        {label}
      </FormLabel>
      {helperText && (
        <FormHelperText color="gray.600" mt="0" mb="2">
          {helperText}
        </FormHelperText>
      )}
      {children}
      {errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default FormField;
