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

import { call } from '../../utils/shared';
import Loader from '../../core/Loader';
import { message } from '../../generic/message';
import Alert from '../../core/Alert';
import { StateContext } from '../../LayoutContainer';
import FormField from '../../forms/FormField';
import { defaultEmails } from '../../../startup/constants';
import ReactQuill from '../../forms/Quill';
import Boxling from './Boxling';
import TablyRouter from '../../generic/TablyRouter';

function EmailForm({ defaultValues, key, onSubmit }) {
  const { control, handleSubmit, register, formState } = useForm({
    defaultValues,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { isDirty, isSubmitting } = formState;

  return (
    <>
      {key && <Heading>{defaultValues.title}</Heading>}
      <Boxling>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <VStack spacing="4">
            <FormField label={t('emails.form.subject.label')}>
              <Input
                {...register('subject')}
                placeholder={t('emails.form.subject.holder')}
              />
            </FormField>

            <FormField label={t('emails.form.appeal.label')}>
              <InputGroup w="280px">
                <Input
                  {...register('appeal')}
                  placeholder={t('emails.form.appeal.holder')}
                />
                <InputRightAddon>
                  {t('emails.form.appeal.addon')}
                </InputRightAddon>
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
              <Button
                isDisabled={!isDirty}
                isLoading={isSubmitting}
                type="submit"
              >
                {tc('actions.submit')}
              </Button>
            </Flex>
          </VStack>
        </form>
      </Boxling>
    </>
  );
}

export default function Emails() {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const { currentUser, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const getEmails = async () => {
    try {
      const savedEmails = await call('getEmails');
      if (savedEmails) {
        setEmails(savedEmails);
      }
      setLoading(false);
    } catch (error) {
      setEmails(defaultEmails);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmails();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  if (!emails) {
    return 'no data';
  }

  const handleSubmit = async (values, emailIndex) => {
    try {
      await call('updateEmail', emailIndex, values);
      getEmails();
      message.success(tc('message.success.update'));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setLoading(false);
    }
  };

  const parsedEmails = emails.map((email, index) => {
    let key = 'new';
    if (index === 1) {
      key = 'verified';
    } else if (index === 2) {
      key = 'admin';
    }

    const title = t(`emails.${key}.title`);

    return {
      title,
      path: key,
      content: (
        <Box py="4" mb="4">
          <Heading size="md" mb="4">
            {title}
          </Heading>
          <EmailForm
            key={key}
            onSubmit={(values) => handleSubmit(values, index)}
            defaultValues={email}
          />
        </Box>
      ),
    };
  });

  return <TablyRouter tabs={parsedEmails} />;
}
