import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import { Controller, useForm } from 'react-hook-form';

import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { editorFormats, editorModules } from '../../@/constants/quillConfig';
import { call } from '../../@/shared';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import FormField from '../../components/FormField';
import { defaultEmails, adminMenu } from '../../@/constants/general';

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
        setEmails(savedEmails);
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

  const handleSubmit = async (values, emailIndex) => {
    try {
      await call('updateEmail', emailIndex, values);
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
        <Box p="4">
          <ListMenu pathname={pathname} list={adminMenu} />
        </Box>
      }
    >
      {emails &&
        emails.map((email, index) => (
          <Box key={email.title} p="6" bg="white" mb="4">
            <Heading size="md" mb="4">
              {email.title}
            </Heading>
            <EmailForm
              onSubmit={(values) => handleSubmit(values, index)}
              defaultValues={email}
            />
          </Box>
        ))}
    </Template>
  );
}

function EmailForm({ defaultValues, onSubmit }) {
  const { control, handleSubmit, register, formState } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;

  return (
    <Box>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="4">
          <FormField label="Subject">
            <Input {...register('subject')} placeholder="Welcome" />
          </FormField>

          <FormField label="Appeal">
            <InputGroup w="280px">
              <Input {...register('appeal')} placeholder="Dear" />
              <InputRightAddon children="@username" />
            </InputGroup>
          </FormField>

          <FormField label="Body">
            <Controller
              control={control}
              name="body"
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                />
              )}
            />
          </FormField>

          <Flex justify="flex-end" py="2" w="100%">
            <Button
              isDisabled={!isDirty}
              isLoading={isSubmitting}
              type="submit"
            >
              Confirm
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}

export default Emails;
