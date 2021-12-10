import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Stack } from '@chakra-ui/react';
import { FieldControl, InputFormik } from 'chakra-formik-experiment';

const SettingsForm = (props) => {
  return (
    <Formik {...props}>
      <Form>
        <Stack spacing={2}>
          <FieldControl label="Name" name="name">
            <InputFormik placeholder="Sandy Art Space" />
          </FieldControl>

          <FieldControl label="Email address" name="email">
            <InputFormik placeholder="contact@sandyartspace.net" />
          </FieldControl>

          <FieldControl label="Address" name="address">
            <InputFormik placeholder="Karl Marx strasse 99" />
          </FieldControl>

          <FieldControl label="City" name="city">
            <InputFormik placeholder="Berlin" />
          </FieldControl>

          <FieldControl label="Country" name="country">
            <InputFormik placeholder="Sri Lanka" />
          </FieldControl>

          <Box>
            <Button
              // isDisabled={!props.formAltered}
              type="submit"
            >
              Confirm
            </Button>
          </Box>
        </Stack>
      </Form>
    </Formik>
  );
};

export default SettingsForm;
