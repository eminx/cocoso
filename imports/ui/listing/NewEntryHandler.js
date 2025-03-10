import React, { createContext, useContext, useState } from 'react';
import { useHref, useSearchParams } from 'react-router-dom';
import { Box, Progress } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import Modal from '../generic/Modal';
import ConfirmModal from '../generic/ConfirmModal';

export const initialLoaderValues = {
  isCreating: false,
  isUploadingImages: false,
  isSendingForm: false,
  isSuccess: false,
};

export const LoaderContext = createContext({ loaders: initialLoaderValues });

const getLoaderValue = (loaders) => {
  let progress = 0;
  if (!loaders.isCreating) {
    progress = 0;
  } else if (loaders.isSuccess) {
    progress = 100;
  } else if (loaders.isSendingForm) {
    progress = 80;
  } else if (loaders.isUploadingImages) {
    progress = 40;
  } else if (loaders.isCreating) {
    progress = 10;
  }
  return progress;
};

const renderToasts = (loaders, tc, justUpdated = false) => {
  const options = { id: 'loader' };
  if (loaders.isSuccess) {
    toast.success(tc(`message.success.${justUpdated ? 'update' : 'create'}`), {
      ...options,
      duration: 3000,
    });
    return;
  }
  if (loaders.isSendingForm) {
    toast.loading(tc('message.loading.sending'), options);
    return;
  }
  if (loaders.isUploadingImages) {
    toast.loading(tc('message.loading.uploading'), options);
    return;
  }
  if (loaders.isCreating) {
    toast.loading(tc('message.loading.creating'), options);
  }
};

export default function NewEntryHandler({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const forNew = searchParams.get('new') === 'true';
  const forEdit = searchParams.get('edit') === 'true';
  const isOpen = forNew || forEdit;
  const { canCreateContent, currentHost } = useContext(StateContext);
  const [loaders, setLoaders] = useState(initialLoaderValues);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tc] = useTranslation('common');

  const onClose = () => {
    setConfirmOpen(false);
    setLoaders(initialLoaderValues);
    if (forEdit) {
      setSearchParams((params) => ({ ...params, edit: 'false' }));
      return;
    }
    setSearchParams((params) => ({ ...params, new: 'false' }));
  };

  const loaderValue = getLoaderValue(loaders);
  const justUpdated = searchParams.get('edit') === 'true' || searchParams.get('edit') === 'false';
  renderToasts(loaders, tc, justUpdated);

  const href = useHref();
  const context = href.split('/')[1] || currentHost?.settings?.menu[0]?.name;
  const string = `common:labels.${forEdit ? 'update' : 'create'}.${context}`;

  const entryHeader = (
    <Box bg="transparent">
      {loaderValue ? (
        <Progress
          colorScheme="brand"
          hasStripe
          size="md"
          value={loaderValue}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
        />
      ) : null}
      <Trans i18nKey={string} />
    </Box>
  );

  if (!canCreateContent) {
    return null;
  }

  return (
    <LoaderContext.Provider value={{ loaders, setLoaders }}>
      <Modal
        closeOnEsc={false}
        contentProps={{
          bg: 'gray.50',
          h: 'auto',
          mt: '12',
        }}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        scrollBehavior="outside"
        size="2xl"
        title={entryHeader}
        onClose={() => setConfirmOpen(true)}
      >
        {children}
        {loaders.isCreating && (
          <Box bg="rgba(0, 0, 0, 0.5)" w="100%" h="100%" position="absolute" top="12px" left="0" />
        )}
      </Modal>

      <ConfirmModal
        confirmText={tc('modals.confirm.newentry.yes')}
        cancelText={tc('modals.confirm.newentry.cancel')}
        title={tc('modals.confirm.newentry.title')}
        visible={confirmOpen}
        onConfirm={onClose}
        onCancel={() => setConfirmOpen(false)}
      >
        {tc('modals.confirm.newentry.body')}
      </ConfirmModal>
    </LoaderContext.Provider>
  );
}
