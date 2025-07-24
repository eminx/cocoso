import React, { useState, useEffect, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Loader,
  Text,
  VStack,
} from '/imports/ui/core';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import { StateContext } from '/imports/ui/LayoutContainer';
import FormField from '/imports/ui/forms/FormField';
import { defaultEmails } from '/imports/startup/constants';
import ReactQuill from '/imports/ui/forms/Quill';
import TablyRouter from '/imports/ui/generic/TablyRouter';

import Boxling from './Boxling';

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
          <VStack>
            <FormField label={t('emails.form.subject.label')} required>
              <Input
                {...register('subject')}
                placeholder={t('emails.form.subject.holder')}
              />
            </FormField>

            <FormField label={t('emails.form.appeal.label')} required>
              <Flex align="center" w="280px">
                <Input
                  {...register('appeal')}
                  placeholder={t('emails.form.appeal.holder')}
                />
                <Text>{t('emails.form.appeal.addon')}</Text>
              </Flex>
            </FormField>

            <FormField label={t('emails.form.body.label')} required>
              <Controller
                control={control}
                name="body"
                render={({ field }) => <ReactQuill {...field} />}
              />
            </FormField>

            <Flex justify="flex-end" py="2" w="100%">
              <Button disabled={!isDirty} loading={isSubmitting} type="submit">
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
        <Box py="8" mb="4">
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
