import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Modal, Progress } from '/imports/ui/core';
import {
  getLoaderProgress,
  loaderAtom,
  renderToasts,
} from '/imports/ui/utils/loaderHandler';

export interface EntryFormHandlerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function EntryFormHandler({ open, title, onClose, children }: EntryFormHandlerProps) {
  const loaders = useAtomValue(loaderAtom);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tc] = useTranslation('common');

  const loaderProgress = getLoaderProgress(loaders);

  const handleClose = () => {
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      {loaders?.isCreating && (
        <Box
          bg="rgba(0, 0, 0, 0.5)"
          w="100%"
          style={{
            position: 'absolute',
            top: '12px',
            left: 0,
          }}
        />
      )}

      {loaderProgress > 0 && (
        <Progress
          colorScheme="brand"
          className="progress"
          hasStripe
          size="md"
          value={loaderProgress}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 99999,
          }}
        />
      )}

      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        hideFooter
        id="new-entry-handler"
        open={open}
        size="2xl"
        title={<Trans i18nKey={title} />}
        onClose={() => setConfirmOpen(true)}
      >
        {children}
      </Modal>
      <Modal
        cancelText={tc('modals.confirm.newentry.cancel')}
        confirmText={tc('modals.confirm.newentry.yes')}
        id="new-entry-handler-confirm-close"
        open={confirmOpen}
        title={tc('modals.confirm.newentry.title')}
        onConfirm={handleClose}
        onClose={() => setConfirmOpen(false)}
      >
        {tc('modals.confirm.newentry.body')}
      </Modal>
    </>
  );
}
