import React from 'react';
import {
  Button,
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
  h,
  isOpen,
  title,
  onClose,
  ...otherProps
}) {
  return (
    <CModal isOpen={isOpen} onClose={onClose} {...otherProps}>
      <ModalOverlay />
      <ModalContent h={h}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          {closeButtonLabel && (
            <Button variant="ghost" mr={3} onClick={onClose}>
              {closeButtonLabel}
            </Button>
          )}
          {actionButtonLabel && <Button>{actionButtonLabel}</Button>}
        </ModalFooter>
      </ModalContent>
    </CModal>
  );
}

export default Modal;
