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
  h = '80%',
  isCentered,
  isOpen,
  scrollBehavior = 'inside',
  secondaryButtonLabel,
  title,
  onClose,
  onActionButtonClick,
  onSecondaryButtonClick,
  children,
  ...otherProps
}) {
  const modalProps = { isCentered, isOpen, scrollBehavior, onClose };

  return (
    <CModal {...modalProps} {...otherProps} data-oid="wv39xcg">
      <ModalOverlay data-oid="rddjb7f" />
      <ModalContent borderRadius="8px" h={h} data-oid="zlk-s7p">
        <ModalHeader data-oid="wci3axm">{title}</ModalHeader>
        <ModalCloseButton onClick={onClose} data-oid="qx4dd05" />
        <ModalBody data-oid="0t_fpwn">{children}</ModalBody>

        <ModalFooter data-oid="m89c9l0">
          {secondaryButtonLabel && (
            <Button
              mr={3}
              variant="ghost"
              onClick={onSecondaryButtonClick || onClose}
              data-oid="n-8.tf4"
            >
              {secondaryButtonLabel}
            </Button>
          )}
          {actionButtonLabel && (
            <Button onClick={onActionButtonClick} {...actionButtonProps} data-oid=":1acn-i">
              {actionButtonLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </CModal>
  );
}

export default Modal;
