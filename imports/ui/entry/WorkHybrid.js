import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import parseHtml from 'html-react-parser';

import TablyCentered from './TablyCentered';
import DocumentsField from '../pages/resources/components/DocumentsField';

export default function WorkHybrid({ documents, work, Host }) {
  if (!work) {
    return null;
  }

  const tabs = [
    {
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {work?.longDescription && parseHtml(work?.longDescription)}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (work.additionalInfo?.length > 2) {
    tabs.push({
      title: <Trans i18nKey="common:labels.extra">Extra</Trans>,
      content: (
        <Box bg="white" p="4">
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
        <Box p="4">
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
        <Box bg="white" className="text-content" p="4" textAlign="center">
          {work?.contactInfo && parseHtml(work.contactInfo)}
        </Box>
      ),
      path: 'contact',
    });
  }

  const tags = work && [work.category?.label];
  const worksInMenu = Host?.settings?.menu.find((item) => item.name === 'works');

  const url = `https://${work.host}/@${work.authorUsername}/works/${work._id}`;

  return (
    <TablyCentered
      action={null}
      adminMenu={null}
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
