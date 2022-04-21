import React from 'react';
import {
  Modal as CModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

function Modal({
  actionButtonLabel,
  closeButtonLabel,
  children,
  title,
  isOpen,
  onClose,
  ...otherProps
}) {
  return (
    <CModal isOpen={isOpen} onClose={onClose} {...otherProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {closeButtonLabel}
            </Button>
          <Button>{actionButtonLabel}</Button>
          </ModalFooter>
        </ModalContent>
      </CModal>
  );
}

export default Modal;
