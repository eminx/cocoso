import React, { useRef } from 'react';
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
  const cancelRef = useRef();
  const [tc] = useTranslation('common');

  return (
    <AlertDialog
      isCentered
      isOpen={visible}
      leastDestructiveRef={cancelRef}
      onClose={onCancel}
      onOverlayClick={onCancel}
      {...otherProps}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{children}</AlertDialogBody>

          {!hideFooter && (
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCancel}>
                {cancelText || tc('actions.cancel')}
              </Button>
              <Button colorScheme="blue" onClick={onConfirm} ml={3} {...confirmButtonProps}>
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
