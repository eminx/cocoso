import React from 'react';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';

function FormField({ children, errorMessage, helperText, label, size = 'sm', ...otherProps }) {
  return (
    <FormControl my="2" {...otherProps} data-oid="yzuusyg">
      <FormLabel color="gray.800" fontWeight="bold" requiredIndicator={'*'} data-oid="xj0-03j">
        {label}
      </FormLabel>
      {helperText && (
        <FormHelperText color="gray.600" mb="3" data-oid="z4mgz_e">
          {helperText}
        </FormHelperText>
      )}
      {children}
      {errorMessage && <FormErrorMessage data-oid="27f84.1">{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
}

export default FormField;
