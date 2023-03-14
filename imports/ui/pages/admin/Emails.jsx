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
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { call } from '../../utils/shared';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import FormField from '../../components/FormField';
import { adminMenu } from '../../utils/constants/general';
import { defaultEmails } from '../../../startup/constants';
import Breadcrumb from '../../components/Breadcrumb';
import ReactQuill from '../../components/Quill';

function Emails({ history }) {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const { currentUser, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

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
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  if (!emails) {
    return 'no data';
  }

  const parsedEmails = emails.map((e, i) => {
    const key = i === 2 ? 'admin' : i === 1 ? 'cocreator' : 'participant';
    return {
      ...e,
      title: t(`emails.${key}.new`),
    };
  });

  const handleSubmit = async (values, emailIndex) => {
    try {
      await call('updateEmail', emailIndex, values);
      message.success(tc('message.success.update', { domain: tc('domains.email') }));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setLoading(false);
    }
  };

  const pathname = history && history.location.pathname;

  const furtherBreadcrumbLinks = [
    {
      label: 'Admin',
      link: '/admin/settings',
    },
    {
      label: t('emails.label'),
      link: null,
    },
  ];

  return (
    <>
      <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      <Template
        heading={t('emails.label')}
        leftContent={
          <Box>
            <ListMenu pathname={pathname} list={adminMenu} />
          </Box>
        }
      >
        {parsedEmails &&
          parsedEmails.map((email, index) => (
            <Box key={email.title} p="4" mb="4" maxWidth={480}>
              <Heading size="md" mb="4">
                {email.title}
              </Heading>
              <EmailForm onSubmit={(values) => handleSubmit(values, index)} defaultValues={email} />
            </Box>
          ))}
      </Template>
    </>
  );
}

function EmailForm({ defaultValues, onSubmit }) {
  const { control, handleSubmit, register, formState } = useForm({
    defaultValues,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { isDirty, isSubmitting } = formState;

  return (
    <Box>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="4">
          <FormField label={t('emails.form.subject.label')}>
            <Input {...register('subject')} placeholder={t('emails.form.subject.holder')} />
          </FormField>

          <FormField label={t('emails.form.appeal.label')}>
            <InputGroup w="280px">
              <Input {...register('appeal')} placeholder={t('emails.form.appeal.holder')} />
              <InputRightAddon children={t('emails.form.appeal.addon')} />
            </InputGroup>
          </FormField>

          <FormField label={t('emails.form.body.label')}>
            <Controller
              control={control}
              name="body"
              render={({ field }) => <ReactQuill {...field} />}
            />
          </FormField>

          <Flex justify="flex-end" py="2" w="100%">
            <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}

export default Emails;
