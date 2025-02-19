import React, { createContext, useContext, useState } from 'react';
import { useHref, useSearchParams } from 'react-router-dom';
import {
  Box,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Progress,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';

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
  }
};

export default function NewEntryHandler({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const forNew = searchParams.get('new') === 'true';
  const forEdit = searchParams.get('edit') === 'true';
  const isOpen = forNew || forEdit;
  const { canCreateContent, currentHost } = useContext(StateContext);
  const [loaders, setLoaders] = useState(initialLoaderValues);
  const [tc] = useTranslation('common');

  const onClose = () => {
    setLoaders(initialLoaderValues);
    if (forEdit) {
      setSearchParams((params) => ({ ...params, edit: 'false' }));
      return;
    }
    setSearchParams((params) => ({ ...params, new: 'false' }));
    setLoaders(initialLoaderValues);
  };

  const loaderValue = getLoaderValue(loaders);
  renderToasts(loaders, tc);

  const href = useHref();
  const context = href.split('/')[1] || currentHost?.settings?.menu[0]?.name;
  const string = `common:labels.${forEdit ? 'update' : 'create'}.${context}`;

  const entryHeader = (
    <Box>
      <Progress
        colorScheme="brand"
        hasStripe
        size="md"
        value={loaderValue}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
      />
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
        isOpen={isOpen}
        motionPreset="slideInBottom"
        scrollBehavior="inside"
        size="full"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="gray.200" borderRadius="lg">
          <ModalHeader
            bg="gray.100"
            borderBottomWidth="2px"
            borderBottomColor="gray.400"
            fontSize="2xl"
          >
            {entryHeader}
          </ModalHeader>
          <ModalCloseButton size="lg" onClick={onClose} />
          <ModalBody py="4">
            <Center>
              <Box maxW="480px" w="100%">
                {children}
              </Box>
            </Center>

            {loaders.isCreating && (
              <Box
                bg="rgba(0, 0, 0, 0.5)"
                w="100%"
                h="100%"
                position="absolute"
                top="12px"
                left="0"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </LoaderContext.Provider>
  );
}
