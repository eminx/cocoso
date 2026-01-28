import React, { useContext, useEffect, useState } from 'react';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { Trans } from 'react-i18next';
import { useSetAtom } from 'jotai';

import { Box, Button, Checkbox, Input } from '/imports/ui/core';
import Modal from '/imports/ui/core/Modal';
import FormField from '/imports/ui/forms/FormField';
import { call } from '../../../../api/_utils/shared';
import { message } from '/imports/ui/generic/message';

import { ComposablePageContext } from '../ComposablePageForm';
import { composablePageTitlesAtom } from '../index';

export default function ComposablePageSettings() {
  const setComposablePageTitles = useSetAtom(composablePageTitlesAtom);
  const { currentPage, getComposablePageById } = useContext(
    ComposablePageContext
  );

  const initialState = {
    hideTitle: currentPage?.settings?.hideTitle,
    hideMenu: currentPage?.settings?.hideMenu,
    modalOpen: false,
    title: currentPage?.title,
  };

  const [state, setState] = useState(initialState);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setState(initialState);
  }, [currentPage]);

  const updateSettings = (field) => {
    setState((prevState) => ({
      ...prevState,
      ...field,
    }));
  };

  const confirmChange = async () => {
    if (state.title === '') {
      message.error(<Trans i18nKey="admin:composable.messages.titleEmpty" />);
      return;
    }
    if (state.title.length > 50) {
      message.error(<Trans i18nKey="admin:composable.messages.titleTooLong" />);
      return;
    }

    setUpdating(true);

    const newPage = {
      ...currentPage,
      title: state.title,
      settings: {
        ...currentPage.settings,
        hideTitle: state.hideTitle,
        hideMenu: state.hideMenu,
      },
    };

    try {
      await call('updateComposablePage', newPage);
      await getComposablePageById();
      setComposablePageTitles(await call('getComposablePageTitles'));
      message.success(<Trans i18nKey="common:message.success.save" />);
      setState((prevState) => ({
        ...prevState,
        modalOpen: false,
      }));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setState({ ...initialState, modalOpen: false });
  };

  return (
    <div style={{ flexGrow: '0' }}>
      <Button
        ml="4"
        rightIcon={<SettingsIcon size="16px" />}
        size="sm"
        variant="ghost"
        onClick={() =>
          setState((prevState) => ({
            ...prevState,
            modalOpen: true,
          }))
        }
      >
        <Trans i18nKey="admin:composable.settings.title" />
      </Button>

      <Modal
        confirmButtonProps={{ loading: updating }}
        id="composable-page-settings"
        open={state.modalOpen}
        title={<Trans i18nKey="admin:composable.settings.title" />}
        onConfirm={confirmChange}
        onClose={handleCloseModal}
      >
        <Box borderRadius="md">
          <Box pb="2">
            <FormField
              label={<Trans i18nKey="admin:composable.form.title" />}
              required
            >
              <Input
                type="text"
                value={state.title}
                onChange={(e) => updateSettings({ title: e.target.value })}
              />
            </FormField>
          </Box>

          <Box pb="4">
            <Checkbox
              checked={state.hideTitle}
              id="hide-title"
              onChange={(e) => updateSettings({ hideTitle: e.target.checked })}
            >
              <Trans i18nKey="admin:composable.settings.hideTitle" />
            </Checkbox>
          </Box>

          <Box>
            <Checkbox
              checked={state.hideMenu}
              id="hide-menu"
              onChange={(e) => updateSettings({ hideMenu: e.target.checked })}
            >
              <Trans i18nKey="admin:composable.settings.hideMenu" />
            </Checkbox>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
