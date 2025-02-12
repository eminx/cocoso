import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Center, Progress } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Modal from '../generic/Modal';
import { StateContext } from '../LayoutContainer';

const initialLoaderValues = {
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

const renderToasts = (loaders, tc) => {
  const options = { id: 'loader' };
  if (loaders.isSuccess) {
    toast.success(tc('message.success.create'), { ...options, duration: 3000 });
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
    return;
  }
  if (!loaders.isCreating) {
    toast.dismiss(options);
  }
};

export default function NewEntryHandler({ title, children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const forNew = searchParams.get('new') === 'true';
  const forEdit = searchParams.get('edit') === 'true';
  const isOpen = forNew || forEdit;
  const { canCreateContent } = useContext(StateContext);
  const [loaders, setLoaders] = useState(initialLoaderValues);
  const [tc] = useTranslation('common');

  const onClose = () => {
    if (forEdit) {
      setSearchParams((params) => ({ ...params, edit: 'false' }));
      return;
    }
    setSearchParams((params) => ({ ...params, new: 'false' }));
    setLoaders(initialLoaderValues);
  };

  if (!canCreateContent) {
    return null;
  }

  const loaderValue = getLoaderValue(loaders);
  renderToasts(loaders, tc);

  const modalTitle = (
    <Box>
      <Progress
        colorScheme="brand"
        hasStripe
        size="md"
        value={loaderValue}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      />
      {title}
    </Box>
  );

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size="full"
      title={modalTitle}
      onClose={onClose}
    >
      <LoaderContext.Provider value={{ loaders, setLoaders }}>
        <Center>
          <Box maxW="480px" w="100%">
            {children}
          </Box>
        </Center>

        {loaders.isCreating && (
          <Box bg="rgba(0, 0, 0, 0.5)" w="100%" h="100%" position="absolute" top="12px" left="0" />
        )}
      </LoaderContext.Provider>
    </Modal>
  );
}
