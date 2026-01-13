import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { Button, Checkbox, Flex, Text } from '/imports/ui/core';

export function PlatformOptions({ initialValues, onSubmit }) {
  const { handleSubmit, register, formState } = useForm({
    defaultValues: initialValues,
  });

  const { isDirty, isSubmitting } = formState;

  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Flex gap="4">
        <Flex align="center">
          <Checkbox mr="2" {...register('isFederationLayout')} />
          <Text fontSize="md">{t('info.platform.federationLabel')}</Text>
          <Text fontSize="sm">{t('info.platform.federationText')}</Text>
        </Flex>
        <Flex align="center">
          <Checkbox mr="2" {...register('showFooterInAllCommunities')} />
          <Text fontSize="sm">{t('info.platform.showfooter')}</Text>
        </Flex>
        <Flex align="center">
          <Checkbox mr="2" {...register('showCommunitiesInMenu')} />
          <Text fontSize="sm">{t('info.platform.showCommunities')}</Text>
        </Flex>
        <Flex justify="flex-end" py="4">
          <Button isDisabled={!isDirty || isSubmitting} type="submit">
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
