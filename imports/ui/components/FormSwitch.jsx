import React from 'react';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

function FormSwitch({ label, ...otherProps }) {
  return (
    <FormControl display="flex" alignItems="center" data-oid="hb0usua">
      <Switch id={label} {...otherProps} data-oid="mmqhq-p" />
      <FormLabel htmlFor={label} mb="0" ml="4" data-oid="9dtf8ik">
        {label}
      </FormLabel>
    </FormControl>
  );
}

export default FormSwitch;
