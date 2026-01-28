import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Trans } from 'react-i18next';
import { useForm } from 'react-hook-form';

import Quill from '/imports/ui/forms/Quill';
import { Box, Button, Center, Flex, Heading, Text } from '/imports/ui/core';
import { currentHostAtom } from '/imports/state';
import { updateHostSettings } from '/imports/actions';

import Boxling from './Boxling';

export default function AdminSettingsFooter() {
  const currentHost = useAtomValue(currentHostAtom);
  const [currentFooter, setCurrentFooter] = useState(null);
  const { handleSubmit, register, formState } = useForm({
    defaultValues: currentHost?.settings?.footer || '',
  });
  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    const defaultFooter = currentHost.settings.footer || '<p>-</p>';
    setCurrentFooter(defaultFooter);
  }, [currentHost]);

  return (
    <Box py="6">
      <Heading as="h3" size="sm" mb="2">
        <Trans i18nKey="admin:settings.tabs.footer" />
      </Heading>

      <Box mb="4">
        <Text>
          <Trans i18nKey="admin:info.platform.footer.description" />
        </Text>
      </Box>

      <Boxling>
        <form
          onSubmit={handleSubmit((data) =>
            updateHostSettings({ values: { footer: currentFooter } })
          )}
        >
          <Quill
            className="ql-editor-text-align-center"
            placeholder={
              <Trans i18nKey="admin:pages.form.description.holder" />
            }
            value={currentFooter}
            onChange={(value) => setCurrentFooter(value)}
          />

          <Flex justify="flex-end" pt="4">
            <Button loading={isSubmitting} type="submit">
              <Trans i18nKey="common:actions.submit" />
            </Button>
          </Flex>
        </form>
      </Boxling>
    </Box>
  );
}
