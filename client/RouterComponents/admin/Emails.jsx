import React, { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../../constants/quillConfig';
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Text,
  TextInput,
} from 'grommet';

import { call } from '../../functions';
import Loader from '../../UIComponents/Loader';
import { message, Alert } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';

const Field = ({ children, ...otherProps }) => (
  <FormField {...otherProps} margin={{ bottom: 'medium' }}>
    {children}
  </FormField>
);

const defaultEmails = {
  welcomeEmail: {
    subject: '',
    appeal: '',
    body: '',
  },
};

export default function Emails() {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState(defaultEmails);

  const { currentUser, currentHost, role } = useContext(StateContext);

  if (!currentUser || role !== 'admin') {
    return <Alert>You are not allowed</Alert>;
  }

  useEffect(() => {
    const getEmails = async () => {
      try {
        const emails = await call('getEmails');
        setEmails(emails);
      } catch (error) {
        console.log(error);
        message.error(error.reason);
      } finally {
        setLoading(false);
      }
    };

    getEmails();
  }, []);

  const handleWelcomeEmailChange = (value) => {
    const newWelcomeEmail = {
      ...value,
      body: emails.welcomeEmail.body,
    };
    setEmails({ ...emails, welcomeEmail: newWelcomeEmail });
  };

  const handleWelcomeEmailBodyChange = (body) => {
    setEmails({ ...emails, welcomeEmail: { ...emails.welcomeEmail, body } });
  };

  const updateWelcomeEmail = async ({ value }) => {
    setLoading(true);
    try {
      await call('updateWelcomeEmail', value);
      message.success('Welcome email is successfully updated');
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      <Heading level={3}>Emails</Heading>
      <Box>
        <Heading level={4}>Welcome Email</Heading>
        <Form
          value={emails.welcomeEmail}
          onChange={handleWelcomeEmailChange}
          onSubmit={updateWelcomeEmail}
        >
          <Field label="Subject">
            <TextInput name="subject" placeholder="Welcome" size="medium" />
          </Field>
          <Field label="Appeal">
            <Box
              direction="row"
              gap="small"
              width="medium"
              align="center"
              justify="start"
            >
              <Box style={{ width: 120 }}>
                <TextInput
                  name="appeal"
                  placeholder="Dear"
                  plain={false}
                  size="small"
                />
              </Box>
              <Text weight="bold">@username</Text>
            </Box>
          </Field>

          <Field label="Body">
            <ReactQuill
              value={emails.welcomeEmail && emails.welcomeEmail.body}
              formats={editorFormats}
              name="body"
              modules={editorModules}
              onChange={handleWelcomeEmailBodyChange}
            />
          </Field>

          <Box direction="row" justify="end" pad="small">
            <Button type="submit" primary label="Confirm" />
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
