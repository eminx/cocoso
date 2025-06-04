import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Input } from '@chakra-ui/react';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';

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
        contentRows: [],
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
          leftIcon={<PlusIcon size="24px" />}
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
          CREATE
        </Button>
      </Center>

      <ConfirmModal
        confirmText="Create"
        title="Please enter a title for your special page"
        visible={createPageModal.visible}
        onConfirm={createComposablePage}
        onCancel={() => setCreatePageModal(emptyPageModal)}
      >
        <FormField label="Title" required>
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
