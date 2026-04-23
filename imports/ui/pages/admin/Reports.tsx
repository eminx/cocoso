import React, { useEffect, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';

import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Select,
  Text,
  Textarea,
} from '/imports/ui/core';
import { BadgeProps } from '/imports/ui/core/Badge';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';
import FormField from '/imports/ui/forms/FormField';
import { currentUserAtom, roleAtom } from '/imports/state';

const STATUS_COLORS: Record<string, BadgeProps['colorScheme']> = {
  pending: 'red',
  reviewed: 'blue',
  resolved: 'green',
  dismissed: 'gray',
};

function ReportItem({ report, onSaved }: { report: any; onSaved: () => void }) {
  const [t] = useTranslation('admin');
  const [status, setStatus] = useState(report.status);
  const [reviewNote, setReviewNote] = useState(report.reviewNote ?? '');
  const [saving, setSaving] = useState(false);

  const STATUS_OPTIONS = [
    { value: 'pending', label: t('reports.status.pending') },
    { value: 'reviewed', label: t('reports.status.reviewed') },
    { value: 'resolved', label: t('reports.status.resolved') },
    { value: 'dismissed', label: t('reports.status.dismissed') },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await call('reports_updateStatus', {
        reportId: report._id,
        status,
        reviewNote,
      });
      message.success(t('reports.messages.success'));
      onSaved();
    } catch (err: any) {
      message.error(err.reason || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      bg="white"
      mb="4"
      p="4"
      css={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      <Flex align="center" justify="space-between" mb="8">
        <Badge colorScheme={STATUS_COLORS[report.status] ?? 'gray'}>
          {t(`reports.status.${report.status}`, {
            defaultValue: report.status,
          })}
        </Badge>
        <Text size="xs" color="gray.600">
          {report.contentType}
        </Text>
        <Text size="xs" color="gray.500">
          {dayjs(report.createdAt).format('DD MMM YYYY HH:mm')}
        </Text>
      </Flex>

      <Flex gap="4" my="4" justify="space-between" w="100%" wrap="wrap">
        <Flex direction="column" gap="1">
          <Text size="xs" color="gray.500">
            {t('reports.fields.reporter')}:
          </Text>
          <Text size="sm" fontWeight="bold">
            {report.reporterUsername ?? report.reporterId}
          </Text>
        </Flex>
        {report.reportedUsername && (
          <Flex direction="column" gap="1">
            <Text size="xs" color="gray.500">
              {t('reports.fields.reportedUser')}:
            </Text>
            <Text size="sm" fontWeight="bold">
              {report.reportedUsername}
            </Text>
          </Flex>
        )}
        {report.contentId && (
          <Flex direction="column" gap="1">
            <Text size="xs" color="gray.500">
              {t('reports.fields.contentId')}:
            </Text>
            <Text size="sm" css={{ fontFamily: 'monospace' }}>
              {report.contentId}
            </Text>
          </Flex>
        )}
      </Flex>

      <Box mb="3">
        <Text color="gray.500">{t('reports.fields.description')}:</Text>
        <Text>
          <em>{report.description}</em>
        </Text>
      </Box>

      <Flex direction="column" gap="2">
        <FormField label={t('reports.fields.status')}>
          <Select
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('reports.fields.reviewNote')}>
          <Textarea
            placeholder={t('reports.fields.reviewNotePlaceholder')}
            rows={5}
            value={reviewNote}
            onChange={(e: any) => setReviewNote(e.target.value)}
          />
        </FormField>

        <Flex justify="flex-end" w="100%">
          <Button loading={saving} onClick={handleSave}>
            {t('reports.actions.save')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default function Reports() {
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const { reports } = useLoaderData() as { reports: any[] | null };
  const { revalidate, state } = useRevalidator();

  useEffect(() => {
    if (currentUser && role === 'admin' && reports === null && state === 'idle') {
      revalidate();
    }
  }, [currentUser, role, reports, state]);

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  if (reports === null) return null;

  if (!reports.length) {
    return (
      <Box p="8">
        <Text color="gray.500">{t('reports.empty')}</Text>
      </Box>
    );
  }

  return (
    <Box>
      {reports.map((r) => (
        <ReportItem key={r._id} report={r} onSaved={revalidate} />
      ))}
    </Box>
  );
}
