import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

import { platformAtom } from '/imports/state';
import { Platform } from '/imports/ui/types';
import { Box, Button, Checkbox, Flex, Text } from '/imports/ui/core';
import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';

export default function PlatformSettingsOptions() {
  const [platform, setPlatform] = useAtom(platformAtom);
  const [state, setState] = useState({
    isFederationLayout: platform?.isFederationLayout || false,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const onSubmit = async () => {
    try {
      await call('updatePlatformSettings', state);
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
      <Box pb="4">
        <Text fontWeight="bold">{t('info.platform.options')}</Text>
      </Box>
      <Flex direction="column" gap="4">
        <Box pr="2" pt="2">
          <Checkbox
            checked={state.isFederationLayout}
            onChange={(e) =>
              setState({ ...state, isFederationLayout: e.target.checked })
            }
          >
            <Box>
              <Text fontSize="lg">{t('info.platform.federationLabel')}</Text>
              <br />
              <Text fontSize="sm">{t('info.platform.federationText')}</Text>
            </Box>
          </Checkbox>
        </Box>
        <Flex justify="flex-end" py="4" w="100%">
          <Button type="submit" onClick={onSubmit}>
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
