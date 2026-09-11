import React, { useContext, useEffect, useRef, useState } from 'react';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { Trans } from 'react-i18next';
import { useSetAtom } from 'jotai';

import { Box, Button, Checkbox, Input, Textarea } from '/imports/ui/core';
import Modal from '/imports/ui/core/Modal';
import FormField from '/imports/ui/forms/FormField';
import { call } from '../../../../api/_utils/shared';
import { message } from '/imports/ui/generic/message';

import { ComposablePageContext } from '../ComposablePageForm';
import { composablePageTitlesAtom } from '../index';

export default function ComposablePageSettings() {
  const setComposablePageTitles = useSetAtom(composablePageTitlesAtom);
  const { currentPage, setCurrentPage } = useContext(ComposablePageContext);

  const initialState = {
    description: currentPage?.description || '',
    hideTitle: currentPage?.settings?.hideTitle,
    hideMenu: currentPage?.settings?.hideMenu,
    modalOpen: false,
    title: currentPage?.title,
  };

  const [state, setState] = useState(initialState);
  const [updating, setUpdating] = useState(false);
  // Tracks whether the save we just kicked off (via the shared
  // pingSave-driven save path, see ComposablePageForm) is still pending,
  // so we know when it's safe to run our own post-save side effects
  // below, rather than calling updateComposablePage directly and racing
  // it against whatever the main editor's autosave effect is doing.
  const awaitingSaveRef = useRef(false);

  useEffect(() => {
    setState(initialState);
  }, [currentPage]);

  useEffect(() => {
    if (!awaitingSaveRef.current || currentPage?.pingSave) {
      return;
    }
    awaitingSaveRef.current = false;
    (async () => {
      setComposablePageTitles(await call('getComposablePageTitles'));
      message.success(<Trans i18nKey="common:message.success.save" />);
      setState((prevState) => ({ ...prevState, modalOpen: false }));
      setUpdating(false);
    })();
  }, [currentPage?.pingSave]);

  const updateSettings = (field) => {
    setState((prevState) => ({
      ...prevState,
      ...field,
    }));
  };

  const confirmChange = () => {
    if (state.title === '') {
      message.error(<Trans i18nKey="admin:composable.messages.titleEmpty" />);
      return;
    }
    if (state.title.length > 50) {
      message.error(<Trans i18nKey="admin:composable.messages.titleTooLong" />);
      return;
    }

    setUpdating(true);
    awaitingSaveRef.current = true;

    setCurrentPage((prevPage) => ({
      ...prevPage,
      title: state.title,
      description: state.description,
      settings: {
        ...prevPage.settings,
        hideTitle: state.hideTitle,
        hideMenu: state.hideMenu,
      },
      pingSave: true,
    }));
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
          <Box>
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

          <Box pb="2">
            <FormField
              helper={
                <Trans i18nKey="admin:composable.form.descriptionHelper" />
              }
              label={<Trans i18nKey="admin:composable.form.description" />}
            >
              <Textarea
                value={state.description}
                onChange={(e) =>
                  updateSettings({ description: e.target.value })
                }
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
