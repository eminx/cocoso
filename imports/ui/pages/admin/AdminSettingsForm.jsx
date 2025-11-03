import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import { Button, Center, Flex, Input, Text } from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';
import ChangeLanguage from '/imports/ui/layout/ChangeLanguageMenu';
import { currentHostAtom } from '/imports/state';
import { updateHostSettings } from '/imports/actions';

import Boxling from './Boxling';

export default function AdminSettingsForm() {
  const currentHost = useAtomValue(currentHostAtom);
  const [localSettings, setLocalSettings] = useState(currentHost?.settings);
  const [t] = useTranslation('hosts');
  const [ta] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const { handleSubmit, register, formState } = useForm({
    defaultValues: localSettings,
  });

  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    setLocalSettings(currentHost.settings);
  }, [currentHost]);

  return (
    <>
      <Center>
        <Text mb="4" fontWeight="bold">
          {ta('info.info')}
        </Text>
      </Center>

      <Boxling>
        <form
          onSubmit={handleSubmit((data) =>
            updateHostSettings({ values: data })
          )}
        >
          <Flex direction="column">
            <FormField label={t('new.name.label')}>
              <Input {...register('name')} />
            </FormField>
            <FormField label={t('new.email.label')}>
              <Input type="email" {...register('email')} />
            </FormField>
            <FormField label={t('new.address.label')}>
              <Input {...register('address')} />
            </FormField>
            <FormField label={t('new.city.label')}>
              <Input {...register('city')} />
            </FormField>
            <FormField label={t('new.country.label')}>
              <Input {...register('country')} />
            </FormField>
            <FormField label={tc('langs.label')}>
              <ChangeLanguage hideHelper select register={register} />
            </FormField>
            <Flex justify="flex-end" py="4">
              <Button disabled={!isDirty || isSubmitting} type="submit">
                {tc('actions.submit')}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Boxling>
    </>
  );
}
