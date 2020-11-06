import React, { useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Heading,
  Form,
  FormField,
  Text,
  TextInput,
} from 'grommet';

import { emailIsValid } from '../functions';
const regexUsername = /[^a-z0-9]+/g;

const Signup = ({ onSubmit }) => {
  const [errors, setErrors] = useState({});
  // const [value, setValue] = useState({});
  // const [touched, setTouched] = useState(false);

  const handleSubmit = (value) => {
    console.log(value, 'handlesubmt');
    const { username, email, password } = value;
    let usernameError, emailError, passwordError;

    if (!username || username.length < 4) {
      usernameError = 'At least 4 characters';
    } else if (regexUsername.test(username)) {
      usernameError = 'Only lowercase-letters and numbers';
    }
    if (!email || email.length === 0) {
      emailError = 'Please type your email';
    } else if (!emailIsValid(email)) {
      emailError = 'Email is not valid';
    }
    if (!password || password.length < 8) {
      passwordError = 'At least 8 characters';
    }

    if (usernameError || emailError || passwordError) {
      setErrors({
        usernameError,
        emailError,
        passwordError,
      });
    } else {
      onSubmit(value);
    }
  };

  return (
    <Box margin={{ bottom: 'medium' }}>
      <Form
        // value={value}
        // onChange={(nextValue) => setValue(nextValue)}
        // onSubmit={({ value, touched }) => console.log(value, touched)}
        onSubmit={({ value }) => console.log(value)}
      >
        <FormField
          label="Username"
          validate={[{ regexp: regexUsername }]}
          help={
            <Text color="dark-3" size="small">
              minimum 4 characters, only lowercase letters and numbers
            </Text>
          }
          error={
            <Text color="status-error" size="small">
              {errors.usernameError}
            </Text>
          }
        >
          <TextInput plain={false} name="username" placeholder="" />
        </FormField>

        <FormField
          label="Email address"
          error={
            <Text color="status-error" size="small">
              {errors.emailError}
            </Text>
          }
        >
          <TextInput plain={false} type="email" name="email" placeholder="" />
        </FormField>

        <FormField
          label="Password"
          help={
            <Text color="dark-3" size="small">
              minimum 8 characters, with at least 1 special
            </Text>
          }
          error={
            <Text color="status-error" size="small">
              {errors.passwordError}
            </Text>
          }
        >
          <TextInput
            plain={false}
            name="password"
            placeholder=""
            type="password"
          />
        </FormField>

        <Box direction="row" justify="end" pad="small">
          <Button
            type="submit"
            primary
            label="Signup"
            // disabled={usernameError || emailError || passwordError}
          />
        </Box>
      </Form>
    </Box>
  );
};

export default Signup;
