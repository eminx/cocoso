import React from 'react';
import { Box, Button, TextInput, FormField, Form } from 'grommet';

const Login = ({ value, onChange, disabled = true }) => {
  return (
    <Form onChange={onChange} value={value}>
      <FormField
        label="Username or Email address"
        margin={{ bottom: 'medium', top: 'medium' }}
      >
        <TextInput plain={false} name="username" placeholder="" />
      </FormField>

      <FormField label="Password" margin={{ bottom: 'medium', top: 'medium' }}>
        <TextInput
          plain={false}
          name="password"
          placeholder=""
          type="password"
        />
      </FormField>

      <Box direction="row" justify="end" pad="small">
        <Button type="submit" primary label="Login" disabled={disabled} />
      </Box>
    </Form>
  );
};

const Signup = ({ value, onChange, disabled = true }) => {
  return (
    <Form onChange={onChange} value={value}>
      <FormField label="Username" margin={{ bottom: 'medium', top: 'medium' }}>
        <TextInput plain={false} name="username" placeholder="" />
      </FormField>

      <FormField
        label="Email address"
        margin={{ bottom: 'medium', top: 'medium' }}
      >
        <TextInput plain={false} name="email" placeholder="" />
      </FormField>

      <FormField label="Password" margin={{ bottom: 'medium', top: 'medium' }}>
        <TextInput
          plain={false}
          name="password"
          placeholder=""
          type="password"
        />
      </FormField>

      <Box direction="row" justify="end" pad="small">
        <Button type="submit" primary label="Login" disabled={disabled} />
      </Box>
    </Form>
  );
};

export { Login, Signup };
