import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Input } from '@chakra-ui/react';
import FilePlusIcon from 'lucide-react/dist/esm/icons/file-plus';
import { Trans } from 'react-i18next';

import ConfirmModal from '/imports/ui/generic/ConfirmModal';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import FormField from '/imports/ui/forms/FormField';

const emptyPageModal = {
  title: '',
  creating: false,
  visible: false,
};

export default function ComposablePageCreator({
  getComposablePageTitles,
}) {
  const [createPageModal, setCreatePageModal] =
    useState(emptyPageModal);
  const navigate = useNavigate();

  const createComposablePage = async () => {
    try {
      const response = await call('createComposablePage', {
        title: createPageModal.title,
      });
      await getComposablePageTitles();
      setCreatePageModal(emptyPageModal);
      message.success('Special Page created successfully');
      navigate(`/admin/composable-pages/${response}`);
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  return (
    <>
      <Center pt="8" pb="4">
        <Button
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

      <ConfirmModal
        confirmText={<Trans i18nKey="admin:composable.create" />}
        title={<Trans i18nKey="admin:composable.title" />}
        visible={createPageModal.visible}
        onConfirm={createComposablePage}
        onCancel={() => setCreatePageModal(emptyPageModal)}
      >
        <FormField
          label={
            <Trans i18nKey="admin:composable.newTitleInputLabel" />
          }
          helperText={
            <Trans i18nKey="admin:composable.newTitleInputHelper" />
          }
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
      </ConfirmModal>
    </>
  );
}
