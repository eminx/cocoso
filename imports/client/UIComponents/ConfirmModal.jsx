import React, { useRef } from 'react';

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

  return (
    <AlertDialog
      isOpen={visible}
      leastDestructiveRef={cancelRef}
      onClose={onCancel}
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
                {cancelText || 'Cancel'}
              </Button>
              <Button
                colorScheme="blue"
                onClick={onConfirm}
                ml={3}
                {...confirmButtonProps}
              >
                {confirmText || 'Confirm'}
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ConfirmModal;
