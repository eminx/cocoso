import React from 'react';
import { Box, Button, Form, FormField, TextInput } from 'grommet';

const SettingsForm = (props) => {
  return (
    <Form {...props}>
      <FormField label="Name">
        <TextInput plain={false} name="name" placeholder="Sandy Art Space" />
      </FormField>

      <FormField label="Email address">
        <TextInput
          plain={false}
          name="email"
          placeholder="contact@sandyartspace.net"
        />
      </FormField>

      <FormField label="Address">
        <TextInput
          plain={false}
          name="address"
          placeholder="Karl Marx strasse 99"
        />
      </FormField>

      <FormField label="City">
        <TextInput plain={false} name="city" placeholder="Berlin" />
      </FormField>

      <FormField label="Country">
        <TextInput plain={false} name="country" placeholder="Sri Lanka" />
      </FormField>

      <Box direction="row" justify="end" pad="small">
        <Button
          type="submit"
          primary
          label="Confirm"
          disabled={!props.formAltered}
        />
      </Box>
    </Form>
  );
};

export default SettingsForm;
