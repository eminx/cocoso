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
      // onClose={onCancel}
      onOverlayClick={onOverlayClick || onCancel}
      {...otherProps}
      data-oid="5tmqcix"
    >
      <AlertDialogOverlay zIndex="1404" data-oid="fo6kr-m">
        <AlertDialogContent data-oid="3q:xf-k">
          <AlertDialogHeader fontSize="lg" fontWeight="bold" data-oid="4vjurt.">
            {title}
          </AlertDialogHeader>

          <AlertDialogCloseButton onClick={onOverlayClick} data-oid="hd8vwhf" />

          <AlertDialogBody data-oid="c.s5a9-">{children}</AlertDialogBody>

          {!hideFooter && (
            <AlertDialogFooter data-oid="v7kams_">
              <Button
                ref={cancelRef}
                size="sm"
                variant="outline"
                onClick={onCancel}
                data-oid="lfhyxt6"
              >
                {cancelText || tc('actions.cancel')}
              </Button>
              <Button
                ml={3}
                size="sm"
                onClick={onConfirm}
                {...confirmButtonProps}
                data-oid="fcpol1o"
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
