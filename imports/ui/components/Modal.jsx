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
  children,
  h,
  isOpen,
  secondaryButtonLabel,
  title,
  onClose,
  onActionButtonClick,
  onSecondaryButtonClick,
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
          {secondaryButtonLabel && (
            <Button mr={3} variant="ghost" onClick={onSecondaryButtonClick || onClose}>
              {secondaryButtonLabel}
            </Button>
          )}
          {actionButtonLabel && <Button onClick={onActionButtonClick}>{actionButtonLabel}</Button>}
        </ModalFooter>
      </ModalContent>
    </CModal>
  );
}

export default Modal;
