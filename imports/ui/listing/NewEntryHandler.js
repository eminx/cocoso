import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHref, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Modal, Progress } from '/imports/ui/core';

import { StateContext } from '../LayoutContainer';

export const initialLoader = {
  isCreating: false,
  isUploadingImages: false,
  isSendingForm: false,
  isSuccess: false,
};

export const LoaderContext = createContext({
  loaders: initialLoader,
});

const getLoaderProgress = (loaders) => {
  let progress = 0;
  if (!loaders) {
    return progress;
  }
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
  if (!loaders) {
    return;
  }

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
  const [loaders, setLoaders] = useState(initialLoader);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tc] = useTranslation('common');

  useEffect(() => {
    const justUpdated =
      searchParams.get('edit') === 'true' ||
      searchParams.get('edit') === 'false';

    renderToasts(loaders, tc, justUpdated);
  }, [searchParams.get('edit')]);

  const handleCancelAndClose = () => {
    setLoaders(initialLoader);
    setConfirmOpen(false);
    if (forEdit) {
      setSearchParams((params) => ({ ...params, edit: 'false' }));
      return;
    }
    setSearchParams((params) => ({ ...params, new: 'false' }));
  };

  const loaderProgress = getLoaderProgress(loaders);

  const href = useHref();
  let context = href.split('/')[1] || currentHost?.settings?.menu[0]?.name;
  if (context[0] === '@') {
    context = 'works';
  }

  const title = `common:labels.${forEdit ? 'update' : 'create'}.${context}`;

  if (!canCreateContent) {
    return null;
  }

  return (
    <LoaderContext.Provider value={{ loaders, setLoaders }}>
      {loaders?.isCreating && (
        <Box
          bg="rgba(0, 0, 0, 0.5)"
          w="100%"
          h="100%"
          position="absolute"
          top="12px"
          left="0"
        />
      )}
      {loaderProgress > 0 ? (
        <Progress
          colorScheme="brand"
          className="progress"
          hasStripe
          size="md"
          value={loaderProgress}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 99999,
          }}
        />
      ) : null}

      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        hideFooter
        open={isOpen}
        size="2xl"
        title={<Trans i18nKey={title} />}
        onClose={() => setConfirmOpen(true)}
      >
        {children}
      </Modal>

      <Modal
        cancelText={tc('modals.confirm.newentry.cancel')}
        confirmText={tc('modals.confirm.newentry.yes')}
        open={confirmOpen}
        title={tc('modals.confirm.newentry.title')}
        onConfirm={handleCancelAndClose}
        onClose={() => setConfirmOpen(false)}
      >
        {tc('modals.confirm.newentry.body')}
      </Modal>
    </LoaderContext.Provider>
  );
}
