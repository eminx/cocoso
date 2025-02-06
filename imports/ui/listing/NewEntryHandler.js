import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Center, Box } from '@chakra-ui/react';

import Modal from '../generic/Modal';

export default function NewEntryHandler({ title, children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get('new') === 'true';

  const onClose = () => {
    setSearchParams((params) => ({ ...params, new: 'false' }));
  };

  return (
    <Modal isOpen={isOpen} motionPreset="slideInBottom" size="full" title={title} onClose={onClose}>
      <Center>
        <Box maxW="480px">{children}</Box>
      </Center>
    </Modal>
  );
}
