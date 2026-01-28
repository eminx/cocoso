import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';

import { platformAtom } from '/imports/state';
import { Platform } from '/imports/ui/types';
import { Button, Flex, Input, Text } from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';
import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';

export default function PlatformSettingsForm() {
  const [platform, setPlatform] = useAtom(platformAtom);
  const initialValues = {
    name: platform?.name || '',
    email: platform?.email || '',
  };
  const { handleSubmit, register, formState } = useForm({
    defaultValues: initialValues,
  });
  const { isDirty, isSubmitting } = formState;
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const onSubmit = async (data: Platform) => {
    try {
      await call('updatePlatformSettings', data);
      const respond = (await call('getPlatform')) as Platform;
      setPlatform(respond);
      message.success(
        tc('message.success.update', { domain: 'Platform options' })
      );
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <>
      <Text fontWeight="bold">{t('info.platform.info')}</Text>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Flex direction="column" gap="4">
          <FormField label={t('info.platform.name')} required>
            <Input {...register('name')} />
          </FormField>
          <FormField label={t('info.platform.email')} required>
            <Input type="email" {...register('email')} />
          </FormField>
          <Flex justify="flex-end" py="4">
            <Button disabled={!isDirty || isSubmitting} type="submit">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
}
