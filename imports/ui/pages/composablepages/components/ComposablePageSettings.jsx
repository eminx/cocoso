import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  VStack,
} from '@chakra-ui/react';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { Trans } from 'react-i18next';

import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import FormField from '/imports/ui/forms/FormField';
import { call } from '/imports/ui/utils/shared';
import { ComposablePageContext } from '../ComposablePageForm';
import { message } from '/imports/ui/generic/message';

export default function ComposablePageSettings() {
  const { currentPage, setCurrentPage, updateComposablePage } =
    useContext(ComposablePageContext);

  const [state, setState] = useState({
    settingsModalOpen: false,
  });

  const updateSettings = (field) => {
    setCurrentPage((prevPage) => ({
      ...prevPage,
      settings: {
        ...prevPage.settings,
        ...field,
      },
    }));
  };

  const renameTitle = (e) => {
    setCurrentPage((prevPage) => ({
      ...prevPage,
      title: e.target.value,
    }));
  };

  const confirmChange = async () => {
    if (currentPage.title === '') {
      message.error(
        <Trans i18nKey="admin:composable.messages.titleEmpty" />
      );
      return;
    }
    if (currentPage.title.length > 50) {
      message.error(
        <Trans i18nKey="admin:composable.messages.titleTooLong" />
      );
      return;
    }
    await updateComposablePage(true);
    setState((prevState) => ({
      ...prevState,
      settingsModalOpen: false,
    }));
  };

  const settings = currentPage?.settings || {};

  return (
    <div>
      <Button
        flexGrow={0}
        ml="4"
        rightIcon={<SettingsIcon size="16px" />}
        variant="ghost"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            settingsModalOpen: true,
          }))
        }
      >
        <Trans i18nKey="admin:composable.settings.title" />
      </Button>

      <ConfirmModal
        title={<Trans i18nKey="admin:composable.settings.title" />}
        visible={state.settingsModalOpen}
        onConfirm={confirmChange}
        onCancel={() =>
          setState((prevState) => ({
            ...prevState,
            settingsModalOpen: false,
          }))
        }
      >
        <Box bg="gray.50" borderRadius="md" p="4">
          <Box py="2">
            <FormField
              label={<Trans i18nKey="admin:composable.form.title" />}
            >
              <Input
                type="text"
                value={currentPage?.title}
                onChange={renameTitle}
              />
            </FormField>
          </Box>

          <Box py="2">
            <Checkbox
              isChecked={settings?.hideTitle}
              onChange={(e) =>
                updateSettings({ hideTitle: e.target.checked })
              }
            >
              <FormField
                label={
                  <Trans i18nKey="admin:composable.settings.hideTitle" />
                }
              />
            </Checkbox>
          </Box>

          <Box py="2">
            <Checkbox
              isChecked={settings?.hideMenu}
              onChange={(e) =>
                updateSettings({ hideMenu: e.target.checked })
              }
            >
              <FormField
                label={
                  <Trans i18nKey="admin:composable.settings.hideMenu" />
                }
              />
            </Checkbox>
          </Box>
        </Box>
      </ConfirmModal>
    </div>
  );
}
