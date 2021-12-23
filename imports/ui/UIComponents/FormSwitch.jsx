import React from 'react';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

function FormSwitch({ isChecked, isDisabled = false, label, onChange }) {
  return (
    <FormControl display="flex" alignItems="center">
      <Switch
        id={label}
        isChecked={isChecked}
        isDisabled={isDisabled}
        onChange={onChange}
      />
      <FormLabel htmlFor={label} mb="0" ml="4">
        {label}
      </FormLabel>
    </FormControl>
  );
}

export default FormSwitch;
