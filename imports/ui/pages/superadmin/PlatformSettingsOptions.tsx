import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';

import { platformAtom } from '/imports/state';
import { Platform } from '/imports/ui/types';
import { Box, Button, Checkbox, Flex, Text } from '/imports/ui/core';
import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';

export default function PlatformSettingsOptions() {
  const [platform, setPlatform] = useAtom(platformAtom);
  const initialValues = {
    isFederationLayout: platform?.isFederationLayout || false,
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
      <Text fontWeight="bold">{t('info.platform.options')}</Text>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Flex direction="column" gap="4">
          <Flex>
            <Box pr="2" pt="2">
              <Checkbox {...register('isFederationLayout')} />
            </Box>
            <Box>
              <Text fontSize="lg">{t('info.platform.federationLabel')}</Text>
              <Text fontSize="sm">{t('info.platform.federationText')}</Text>
            </Box>
          </Flex>
          <Flex justify="flex-end" py="4">
            <Button isDisabled={!isDirty || isSubmitting} type="submit">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
}
