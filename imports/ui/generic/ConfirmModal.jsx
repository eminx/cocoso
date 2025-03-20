import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

function ConfirmModal({
  cancelText,
  confirmButtonProps,
  confirmText,
  hideFooter,
  title,
  visible,
  onCancel,
  onConfirm,
  onOverlayClick,
  children,
  ...otherProps
}) {
  const cancelRef = useRef();
  const [tc] = useTranslation('common');

  return (
    <AlertDialog
      closeOnOverlayClick={false}
      isCentered
      isOpen={visible}
      leastDestructiveRef={cancelRef}
      scrollBehavior="inside"
      zIndex={9999}
      onClose={onOverlayClick || onCancel}
      onOverlayClick={onOverlayClick || onCancel}
      {...otherProps}
    >
      <AlertDialogOverlay zIndex={9999}>
        <AlertDialogContent zIndex={9999}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogCloseButton onClick={onOverlayClick || onCancel} />

          <AlertDialogBody mb="12">{children}</AlertDialogBody>

          {!hideFooter && (
            <AlertDialogFooter>
              <Button ref={cancelRef} size="sm" variant="outline" onClick={onCancel}>
                {cancelText || tc('actions.cancel')}
              </Button>
              <Button ml={3} size="sm" onClick={onConfirm} {...confirmButtonProps}>
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
