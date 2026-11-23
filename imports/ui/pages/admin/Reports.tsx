import React, { useEffect, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { currentUserAtom, roleAtom } from '/imports/state';
import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Select,
  Text,
  Textarea,
} from '/imports/ui/core';
import { BadgeProps } from '/imports/ui/core/Badge';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';
import FormField from '/imports/ui/forms/FormField';

import Boxling from './Boxling';

const STATUS_COLORS: Record<string, BadgeProps['colorScheme']> = {
  pending: 'red',
  reviewed: 'blue',
  resolved: 'green',
  dismissed: 'gray',
};

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <Flex direction="column" gap="1">
      <Text size="xs" color="gray.500">
        {label}:
      </Text>
      <Text size="xs" css={{ fontFamily: 'monospace' }}>
        {value}
      </Text>
    </Flex>
  );
}

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
    <Boxling
      mb="8"
      css={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      }}
    >
      <Flex justify="space-between">
        <Link href={report.reportedLink} target="_blank">
          <Heading size="sm">
            {report.reportedTitle || report.reportedUserId}{' '}
            <ExternalLink width={20} height={20} />
          </Heading>
        </Link>

        <Badge colorScheme={STATUS_COLORS[report.status] ?? 'gray'}>
          {t(`reports.status.${report.status}`, {
            defaultValue: report.status,
          })}
        </Badge>
      </Flex>

      <Flex gap="4" justify="flex-start" mb="6" w="100%" wrap="wrap">
        <InfoCell
          label={t('reports.fields.reporter')}
          value={report.reporterUsername ?? report.reporterId}
        />
        {report.reportedUsername && (
          <InfoCell
            label={t('reports.fields.reportedUser')}
            value={report.reportedUsername}
          />
        )}
        {report.contentId && (
          <InfoCell
            label={t('reports.fields.contentId')}
            value={report.contentId}
          />
        )}
        {report.contentType && (
          <InfoCell
            label={t('reports.fields.contentType')}
            value={report.contentType}
          />
        )}
        {report.createdAt && (
          <InfoCell
            label={t('reports.fields.date')}
            value={dayjs(report.createdAt).format('DD MMM YYYY')}
          />
        )}
      </Flex>

      <Box mb="2">
        <FormField label={t('reports.fields.description')}>
          <Text>
            <em>{report.description}</em>
          </Text>
        </FormField>
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
    </Boxling>
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
    if (
      currentUser &&
      role === 'admin' &&
      reports === null &&
      state === 'idle'
    ) {
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
