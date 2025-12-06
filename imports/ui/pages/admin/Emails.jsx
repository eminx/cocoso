import React, { useState, useMemo, useEffect } from 'react';
import { Outlet, useLoaderData, useSearchParams } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Loader,
  Tabs,
  Text,
} from '/imports/ui/core';
import { call } from '../../../api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import { currentUserAtom, roleAtom } from '../../../state';
import FormField from '/imports/ui/forms/FormField';
import { defaultEmails } from '/imports/startup/constants';
import Quill from '/imports/ui/forms/Quill';

import Boxling from './Boxling';
import AdminTabs from './AdminTabs';

function EmailForm({ defaultValues, onSubmit }) {
  const { control, handleSubmit, register, formState } = useForm({
    defaultValues,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { isDirty, isSubmitting } = formState;

  return (
    <Box py="4" mb="4">
      <Heading size="md" mb="4">
        {defaultValues.title}
      </Heading>

      <Boxling>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Flex direction="column">
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
                render={({ field }) => <Quill {...field} />}
              />
            </FormField>

            <Flex justify="flex-end" py="2" w="100%">
              <Button disabled={!isDirty} loading={isSubmitting} type="submit">
                {tc('actions.submit')}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Boxling>
    </Box>
  );
}

export default function Emails() {
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);
  const { emails } = useLoaderData();
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  if (!emails) {
    return 'no data';
  }

  const handleSubmit = async (values, emailIndex) => {
    try {
      await call('updateEmail', values, emailIndex);
      message.success(tc('message.success.update'));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setLoading(false);
    }
  };

  const parsedEmails = useMemo(
    () =>
      emails.map((email, index) => {
        let key = 'new';
        if (index === 1) {
          key = 'verified';
        } else if (index === 2) {
          key = 'admin';
        }

        return {
          key,
          title: t(`emails.${key}.title`),
          onClick: () =>
            setSearchParams((params) => ({ ...params, show: key })),
        };
      }),
    [emails]
  );

  const show = searchParams.get('show');
  const key = ['new', 'verified', 'admin'].includes(show) ? show : 'new';

  const tabIndex = show
    ? parsedEmails.findIndex((email) => email.key === show)
    : 0;

  const selectedEmail =
    key === 'admin' ? emails[2] : key === 'verified' ? emails[1] : emails[0];

  return (
    <>
      <Tabs tabs={parsedEmails} index={tabIndex} />

      <EmailForm
        key={key}
        onSubmit={(values) => handleSubmit(values, tabIndex)}
        defaultValues={selectedEmail}
      />
    </>
  );
}
