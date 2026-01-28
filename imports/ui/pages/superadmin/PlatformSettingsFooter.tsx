import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

import { Box, Button, Flex, Text } from '/imports/ui/core';
import { platformAtom } from '/imports/state';
import { Platform } from '/imports/ui/types';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';
import Quill from '/imports/ui/forms/Quill';

export default function PlatformSettingsFooter() {
  const [platform, setPlatform] = useAtom(platformAtom);
  const [value, setValue] = useState(platform?.footer || '');
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const handleSubmit = async () => {
    try {
      await call('updatePlatformSettings', { footer: value });
      const respond = (await call('getPlatform')) as Platform;
      setPlatform(respond);
      message.success(
        tc('message.success.update', { domain: 'Platform footer' })
      );
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <>
      <Box pb="4">
        <Text fontWeight="bold">{t('info.platform.footer.label')}</Text>
        <br />
        <Text>{t('info.platform.footer.description')}</Text>
      </Box>

      <Box w="100%">
        <Quill value={value} onChange={(value) => setValue(value)} />
        <Flex justify="flex-end" mt="4" w="100%">
          <Button type="submit" onClick={handleSubmit}>
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Box>
    </>
  );
}
