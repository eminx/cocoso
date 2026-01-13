import React from 'react';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

import { Box, Text } from '/imports/ui/core';
import DocumentsField from '/imports/ui/pages/resources/components/DocumentsField';

import TablyCentered from './TablyCentered';

interface Document {
  _id: string;
  name?: string;
}

interface Work {
  _id: string;
  title?: string;
  host?: string;
  authorUsername?: string;
  authorAvatar?: string;
  shortDescription?: string;
  longDescription?: string;
  additionalInfo?: string;
  contactInfo?: string;
  imageUrl?: string;
  showAvatar?: boolean;
  category?: {
    label?: string;
  };
}

interface Host {
  settings?: {
    menu?: Array<{
      name: string;
      label?: string;
    }>;
  };
}

export interface WorkHybridProps {
  documents?: Document[];
  work: Work;
  Host: Host;
}

export default function WorkHybrid({ documents, work, Host }: WorkHybridProps) {
  if (!work) {
    return null;
  }

  const tabs = [
    {
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {work?.longDescription &&
            HTMLReactParser(DOMPurify.sanitize(work?.longDescription))}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (work.additionalInfo?.length > 2) {
    tabs.push({
      title: <Trans i18nKey="common:labels.extra">Extra</Trans>,
      content: (
        <Box bg="white" p="6">
          <Text textAlign="center">{work?.additionalInfo}</Text>
        </Box>
      ),
      path: 'extra',
    });
  }

  if (documents && documents[0]) {
    tabs.push({
      title: <Trans i18nKey="common:documents.label">Documents</Trans>,
      content: (
        <Box p="6">
          <DocumentsField contextType="works" contextId={work?._id} />
        </Box>
      ),
      path: 'documents',
    });
  }

  if (work.contactInfo) {
    tabs.push({
      title: <Trans i18nKey="common:labels.contact">Contact</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6" textAlign="center">
          {work?.contactInfo &&
            HTMLReactParser(DOMPurify.sanitize(work.contactInfo))}
        </Box>
      ),
      path: 'contact',
    });
  }

  const tags = work && [work.category?.label];
  const worksInMenu = Host?.settings?.menu.find(
    (item) => item.name === 'works'
  );

  const url = `https://${work.host}/@${work.authorUsername}/works/${work._id}`;

  return (
    <TablyCentered
      author={
        work.showAvatar && {
          src: work.authorAvatar,
          username: work.authorUsername,
        }
      }
      backLink={{ value: '/works', label: worksInMenu.label }}
      images={work?.images || [work.imageUrl]}
      subTitle={work.shortDescription}
      tabs={tabs}
      tags={tags}
      title={work.title}
      url={url}
    />
  );
}
