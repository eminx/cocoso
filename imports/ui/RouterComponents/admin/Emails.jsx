import React, { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import {
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Text,
  TextInput,
} from 'grommet';

import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import { editorFormats, editorModules } from '../../constants/quillConfig';
import { call } from '../../functions';
import Loader from '../../UIComponents/Loader';
import { message, Alert } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';
import { defaultEmails, adminMenu } from '../../constants/general';

const Field = ({ children, ...otherProps }) => (
  <FormField {...otherProps} margin={{ bottom: 'medium' }}>
    {children}
  </FormField>
);

function Emails({ history }) {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const { currentUser, role } = useContext(StateContext);

  useEffect(() => {
    getEmails();
  }, []);

  const getEmails = async () => {
    try {
      const savedEmails = await call('getEmails');
      if (savedEmails) {
        const savedEmailsUnaltered = savedEmails.map((email) => ({
          ...email,
          isAltered: false,
        }));
        setEmails(savedEmailsUnaltered);
      }
      setLoading(false);
    } catch (error) {
      setEmails(defaultEmails);
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>You are not allowed</Alert>;
  }

  if (!emails) {
    return 'no data';
  }

  const handleChange = (emailIndex, value) => {
    const newEmails = [...emails];
    newEmails[emailIndex] = {
      ...value,
      body: emails[emailIndex].body,
      isAltered: true,
    };

    setEmails(newEmails);
  };

  const handleBodyChange = (emailIndex, value) => {
    const newEmails = [...emails];
    newEmails[emailIndex] = {
      ...emails[emailIndex],
      body: value,
      isAltered: true,
    };

    setEmails(newEmails);
  };

  const handleSubmit = async (emailIndex) => {
    setLoading(true);
    const email = { ...emails[emailIndex] };
    delete email.isAltered;

    try {
      await call('updateEmail', emailIndex, email);
      const newEmails = [...emails];
      newEmails[emailIndex].isAltered = false;
      setEmails(newEmails);
      message.success('Email is successfully updated');
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setLoading(false);
    }
  };

  const pathname = history && history.location.pathname;

  return (
    <Template
      heading="Emails"
      leftContent={
        <Box pad="medium">
          <ListMenu list={adminMenu}>
            {(datum) => (
              <Anchor
                onClick={() => history.push(datum.value)}
                key={datum.value}
                label={
                  <Text weight={pathname === datum.value ? 'bold' : 'normal'}>
                    {datum.label}
                  </Text>
                }
              />
            )}
          </ListMenu>
        </Box>
      }
    >
      {emails &&
        emails.map((email, index) => (
          <Box
            key={email.title}
            pad="medium"
            background="white"
            margin={{ bottom: 'medium' }}
          >
            <Heading level={3}>{email.title}</Heading>
            <Form
              value={email}
              onChange={(value) => handleChange(index, value)}
              onSubmit={() => handleSubmit(index)}
            >
              <Field label="Subject" name="subject">
                <TextInput name="subject" placeholder="Welcome" size="medium" />
              </Field>
              <Field label="Appeal" name="appeal">
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

              <Field label="Body" name="body">
                <ReactQuill
                  value={email && email.body}
                  formats={editorFormats}
                  modules={editorModules}
                  name="body"
                  onChange={(value) => handleBodyChange(index, value)}
                />
              </Field>

              <Box direction="row" justify="end" pad="small">
                <Button
                  disabled={email && !email.isAltered}
                  type="submit"
                  primary
                  label="Confirm"
                />
              </Box>
            </Form>
          </Box>
        ))}
    </Template>
  );
}

export default Emails;
