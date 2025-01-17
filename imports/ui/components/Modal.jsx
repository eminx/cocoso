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
  actionButtonProps,
  children,
  h,
  isOpen,
  scrollBehavior = 'inside',
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
      <ModalContent borderRadius="8px" h={h}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          {secondaryButtonLabel && (
            <Button mr={3} variant="ghost" onClick={onSecondaryButtonClick || onClose}>
              {secondaryButtonLabel}
            </Button>
          )}
          {actionButtonLabel && (
            <Button onClick={onActionButtonClick} {...actionButtonProps}>
              {actionButtonLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </CModal>
  );
}

export default Modal;
