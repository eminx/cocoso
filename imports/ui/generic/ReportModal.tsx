import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Alert, Box, Modal, Text, Textarea } from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';

import { message } from './message';

export type ReportContentType =
  | 'directMessage'
  | 'activity'
  | 'group'
  | 'work'
  | 'page'
  | 'user';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId?: string;
  reportedUsername?: string;
  contentType: ReportContentType;
  contentId?: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  reportedUserId,
  reportedUsername,
  contentType,
  contentId,
}: Props) {
  const [t] = useTranslation('accounts');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      message.error(t('report.messages.required'));
      return;
    }
    setSubmitting(true);
    try {
      await Meteor.callAsync('reports_create', {
        reportedUserId,
        contentType,
        contentId,
        description,
      });
      message.success(t('report.messages.success'));
      setDescription('');
      onClose();
    } catch (err: any) {
      message.error(err.reason || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  return (
    <Modal
      cancelText={<Trans i18nKey="common:actions.cancel">Cancel</Trans>}
      confirmText={
        submitting ? (
          <Trans i18nKey="common:actions.submitting">Submitting…</Trans>
        ) : (
          <Trans i18nKey="common:actions.submit">Submit report</Trans>
        )
      }
      id="report-modal"
      open={isOpen}
      size="xl"
      title={
        reportedUsername
          ? t('report.title', { username: reportedUsername })
          : t('report.titleGeneric')
      }
      onConfirm={handleSubmit}
      onClose={handleClose}
    >
      <Box>
        {contentType === 'directMessage' && (
          <Alert
            mb="8"
            type="info"
            css={{
              backgroundColor: 'var(--cocoso-colors-gray-100)',
              border: 'none',
            }}
          >
            <Text fontSize="sm">{t('report.e2eeWarning')}</Text>
          </Alert>
        )}

        <FormField label={t('report.form.label')}>
          <Textarea
            placeholder={t('report.form.placeholder')}
            rows={12}
            value={description}
            style={{ padding: '1.2rem 1.5rem' }}
            onChange={(e: any) => setDescription(e.target.value)}
          />
        </FormField>
      </Box>
    </Modal>
  );
}
