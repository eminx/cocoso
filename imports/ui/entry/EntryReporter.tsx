import React, { useState } from 'react';
import { Trans } from 'react-i18next';

import { Button, Center } from '/imports/ui/core';
import ReportModal, { ReportContentType } from '../generic/ReportModal';

interface EntryReporterProps {
  contentId: string;
  contentType: ReportContentType;
  reportedUserId: string;
  reportedTitle?: string;
}

export default function EntryReporter({
  contentId,
  contentType,
  reportedUserId,
  reportedTitle,
}: EntryReporterProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Center mb="8">
        <Button
          size="xs"
          variant="ghost"
          css={{ color: 'var(--cocoso-colors-gray-600)' }}
          onClick={() => setModalOpen(true)}
        >
          <Trans i18nKey="accounts:report.label" />
        </Button>
      </Center>
      <ReportModal
        contentId={contentId}
        contentType={contentType}
        isOpen={modalOpen}
        reportedUserId={reportedUserId}
        reportedTitle={reportedTitle}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
