import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';

import { Alert, Box, Modal, Text, Textarea } from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';

import { message } from './message';

export type ReportContentType =
  | 'directMessage'
  | 'activities'
  | 'groups'
  | 'info'
  | 'resources'
  | 'users'
  | 'works';

interface Props {
  contentId?: string;
  contentType: ReportContentType;
  reportedUserId?: string;
  reporterUserId?: string;
  reportedUsername?: string;
  reportedTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({
  contentId,
  contentType,
  isOpen,
  onClose,
  reportedUserId,
  reportedUsername,
  reportedTitle,
}: Props) {
  const [t] = useTranslation('accounts');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  const handleSubmit = async () => {
    if (!description.trim()) {
      message.error(t('report.messages.required'));
      return;
    }
    setSubmitting(true);

    try {
      await Meteor.callAsync('reports_create', {
        contentId,
        contentType,
        description,
        reportedUserId,
        reportedTitle,
        reportedPathname: location?.pathname,
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
        reportedTitle
          ? t('report.title', { reported: reportedTitle || reportedUsername })
          : t('report.titleGeneric')
      }
      onConfirm={handleSubmit}
      onClose={handleClose}
    >
      <Box>
        {contentType === 'directMessage' && (
          <Alert type="info">
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
