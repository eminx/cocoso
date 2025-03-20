import React from 'react';
import { Box, Wrap, Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';

import TablyCentered from './TablyCentered';
import DocumentsField from '../pages/resources/components/DocumentsField';

export default function ResourceHybrid({ documents, resource, Host }) {
  if (!resource) {
    return null;
  }

  const tabs = [
    {
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {resource?.description && HTMLReactParser(resource?.description)}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (resource.isCombo) {
    tabs.push({
      title: <Trans i18nKey="resources:labels.combo">Combo</Trans>,
      content: (
        <Wrap justify="center" spacing="2" pt="4">
          {resource.resourcesForCombo.map((res) => (
            <Box key={res._id} bg="white" borderRadius="lg" cursor="pointer" p="2" textAlign="left">
              <Text fontSize="lg">{res.label}</Text>
            </Box>
          ))}
        </Wrap>
      ),
      path: 'combo',
    });
  }

  if (documents && documents[0]) {
    tabs.push({
      title: <Trans i18nKey="common:documents.label">Documents</Trans>,
      content: (
        <Box p="4">
          <DocumentsField contextType="works" contextId={resource?._id} />
        </Box>
      ),
      path: 'documents',
    });
  }

  // if (currentUser && canCreateContent && resource.isBookable) {
  //   tabs.push({
  //     title: t('booking.labels.field'),
  //     content: <BookingsField currentUser={currentUser} selectedResource={resource} />,
  //     path: 'bookings',
  //   });
  // }

  const tags = [];
  if (resource.isCombo) {
    tags.push(<Trans i18nKey="resources:cards.isCombo">Combo</Trans>);
  }

  if (resource.isBookable) {
    tags.push(<Trans i18nKey="resources:cards.isBookable">Bookable</Trans>);
  }

  const resourcesInMenu = Host?.settings?.menu?.find((item) => item.name === 'resources');
  const backLink = {
    value: '/resources',
    label: resourcesInMenu?.label,
  };

  return (
    <TablyCentered
      action={null}
      adminMenu={null}
      backLink={backLink}
      images={resource?.images}
      tabs={tabs}
      tags={tags}
      title={resource.label}
    />
  );
}
