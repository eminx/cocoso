import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';

function ConfirmModal({
  visible,
  title,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmButtonProps,
  hideFooter,
  children,
  ...otherProps
}) {
  const { hue } = useContext(StateContext);
  const backgroundColor = hue ? `hsl(${hue}deg, 10%, 90%)` : 'gray.200';
  const cancelRef = useRef();
  const [tc] = useTranslation('common');

  return (
    <AlertDialog
      isCentered
      isOpen={visible}
      leastDestructiveRef={cancelRef}
      scrollBehavior="inside"
      onClose={onCancel}
      onOverlayClick={onCancel}
      {...otherProps}
    >
      <AlertDialogOverlay zIndex="1404">
        <AlertDialogContent bg={backgroundColor}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{children}</AlertDialogBody>

          {!hideFooter && (
            <AlertDialogFooter>
              <Button ref={cancelRef} size="sm" onClick={onCancel}>
                {cancelText || tc('actions.cancel')}
              </Button>
              <Button
                colorScheme="blue"
                ml={3}
                size="sm"
                onClick={onConfirm}
                {...confirmButtonProps}
              >
                {confirmText || tc('actions.submit')}
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ConfirmModal;
