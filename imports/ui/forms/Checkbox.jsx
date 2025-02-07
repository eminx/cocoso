import React from 'react';
import { Checkbox, FormControl, FormLabel } from '@chakra-ui/react';

function FormSwitch({ label, ...otherProps }) {
  return (
    <FormControl display="flex" alignItems="center">
      <Checkbox id={label} {...otherProps} />
      <FormLabel htmlFor={label} mb="0" ml="4">
        {label}
      </FormLabel>
    </FormControl>
  );
}

export default FormSwitch;
