import React, { useContext } from 'react';
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

import { StateContext } from '../LayoutContainer';

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
  const { hue } = useContext(StateContext);
  const backgroundColor = hue ? `hsl(${hue}deg, 10%, 90%)` : 'gray.200';

  return (
    <CModal isOpen={isOpen} onClose={onClose} {...otherProps}>
      <ModalOverlay />
      <ModalContent bg={backgroundColor} h={h}>
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
