import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Center, Box } from '@chakra-ui/react';

import Modal from '../generic/Modal';
import { StateContext } from '../LayoutContainer';

export default function NewEntryHandler({ title, children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get('new') === 'true';
  const { canCreateContent } = useContext(StateContext);

  const onClose = () => {
    setSearchParams((params) => ({ ...params, new: 'false' }));
  };

  if (!canCreateContent) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} motionPreset="slideInBottom" size="full" title={title} onClose={onClose}>
      <Center>
        <Box maxW="480px" w="100%">
          {children}
        </Box>
      </Center>
    </Modal>
  );
}
