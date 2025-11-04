import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Trans } from 'react-i18next';
import Quill from '/imports/ui/forms/Quill';

import { Box, Button, Center, Flex, Text } from '/imports/ui/core';
import { currentHostAtom } from '/imports/state';
import { updateHostSettings } from '/imports/actions';

import Boxling from './Boxling';

export default function AdminSettingsFooter() {
  const currentHost = useAtomValue(currentHostAtom);
  const [currentFooter, setCurrentFooter] = useState(null);

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    const defaultFooter = currentHost.settings.footer || '<p>-</p>';
    setCurrentFooter(defaultFooter);
  }, [currentHost]);

  return (
    <>
      <Center>
        <Text mb="4" fontWeight="bold">
          <Trans i18nKey="admin:settings.tabs.footer" />
        </Text>
      </Center>
      <Box mb="4">
        <Text>
          <Trans i18nKey="admin:info.platform.footer.description" />
        </Text>
      </Box>

      <Boxling>
        <Quill
          className="ql-editor-text-align-center"
          placeholder={<Trans i18nKey="admin:pages.form.description.holder" />}
          value={currentFooter}
          onChange={(value) => setCurrentFooter(value)}
        />

        <Flex justify="flex-end" pt="4">
          <Button
            onClick={() =>
              updateHostSettings({
                values: { ...currentHost.settings, footer: currentFooter },
              })
            }
          >
            <Trans i18nKey="common:actions.submit" />
          </Button>
        </Flex>
      </Boxling>
    </>
  );
}
