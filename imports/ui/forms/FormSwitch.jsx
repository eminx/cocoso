import React from 'react';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

function FormSwitch(props) {
  const { label, ...otherProps } = props;
  return (
    <FormControl display="flex" alignItems="center">
      <Switch id={label} {...otherProps} />
      <FormLabel htmlFor={label} mb="0" ml="4">
        {label}
      </FormLabel>
    </FormControl>
  );
}

export default FormSwitch;
