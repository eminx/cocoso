import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FilePlusIcon from 'lucide-react/dist/esm/icons/file-plus';
import { Trans } from 'react-i18next';
import { useSetAtom } from 'jotai';

import { Button, Center, Input, Modal } from '/imports/ui/core';
import { pageTitlesAtom } from '/imports/state';
import { call } from '../../../../api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import FormField from '/imports/ui/forms/FormField';

import { composablePageTitlesAtom } from '../index';

const emptyPageModal = {
  title: '',
  creating: false,
  visible: false,
};

export default function ComposablePageCreator() {
  const setComposablePageTitles = useSetAtom(composablePageTitlesAtom);
  const [createPageModal, setCreatePageModal] = useState(emptyPageModal);
  const navigate = useNavigate();

  const createComposablePage = async () => {
    try {
      const response = await call('createComposablePage', {
        title: createPageModal.title,
      });
      setComposablePageTitles(await call('getComposablePageTitles'));
      setCreatePageModal(emptyPageModal);
      message.success('Special Page created successfully');
      navigate(`/admin/composable-pages/${response}`);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  return (
    <>
      <Center pt="8" pb="4">
        <Button
          bg="white"
          leftIcon={<FilePlusIcon size="24px" />}
          mb="4"
          size="lg"
          variant="outline"
          onClick={() =>
            setCreatePageModal((prevModal) => ({
              ...prevModal,
              visible: true,
            }))
          }
        >
          <Trans i18nKey="admin:composable.new" />
        </Button>
      </Center>

      <Modal
        confirmText={<Trans i18nKey="admin:composable.create" />}
        id="composable-page-creator"
        open={createPageModal.visible}
        title={<Trans i18nKey="admin:composable.title" />}
        onConfirm={createComposablePage}
        onClose={() => setCreatePageModal(emptyPageModal)}
      >
        <FormField
          label={<Trans i18nKey="admin:composable.newTitleInputLabel" />}
          helperText={<Trans i18nKey="admin:composable.newTitleInputHelper" />}
          required
        >
          <Input
            size="lg"
            value={createPageModal.title}
            onChange={(e) =>
              setCreatePageModal((prevState) => ({
                ...prevState,
                title: e.target.value,
              }))
            }
          />
        </FormField>
      </Modal>
    </>
  );
}
