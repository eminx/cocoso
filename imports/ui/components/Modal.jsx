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
} from '@chakra-ui/react';

function Modal({
  actionButtonLabel,
  closeButtonLabel,
  children,
  h,
  isOpen,
  title,
  onClose,
  onActionButtonClick,
  ...otherProps
}) {
  return (
    <CModal isOpen={isOpen} onClose={onClose} {...otherProps}>
      <ModalOverlay />
      <ModalContent bg="brand.50" h={h}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          {closeButtonLabel && (
            <Button variant="ghost" mr={3} onClick={onClose}>
              {closeButtonLabel}
            </Button>
          )}
          {actionButtonLabel && <Button onClick={onActionButtonClick}>{actionButtonLabel}</Button>}
        </ModalFooter>
      </ModalContent>
    </CModal>
  );
}

export default Modal;
