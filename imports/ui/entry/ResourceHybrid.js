import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';

import { Box, Text, VStack } from '/imports/ui/core';
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
          {resource?.description &&
            HTMLReactParser(resource?.description)}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (resource.isCombo) {
    tabs.push({
      title: <Trans i18nKey="resources:labels.combo">Combo</Trans>,
      content: (
        <VStack pt="4" spacing="2">
          {resource.resourcesForCombo.map((res) => (
            <Link key={res._id} to={`/resources/${res._id}/info`}>
              <Box
                css={{
                  ':hover': {
                    backgroundColor: 'white',
                  },
                }}
                px="4"
                py="2"
                textAlign="left"
              >
                <Text fontSize="lg">{res.label}</Text>
              </Box>
            </Link>
          ))}
        </VStack>
      ),
      path: 'combo',
    });
  }

  if (documents && documents[0]) {
    tabs.push({
      title: <Trans i18nKey="common:documents.label">Documents</Trans>,
      content: (
        <Box p="4">
          <DocumentsField
            contextType="works"
            contextId={resource?._id}
          />
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
    tags.push(
      <Trans i18nKey="resources:cards.isBookable">Bookable</Trans>
    );
  }

  const resourcesInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'resources'
  );
  const backLink = {
    value: '/resources',
    label: resourcesInMenu?.label,
  };

  const url = `https://${resource.host}/resources/${resource._id}`;

  return (
    <TablyCentered
      backLink={backLink}
      images={resource?.images}
      tabs={tabs}
      tags={tags}
      title={resource.label}
      url={url}
    />
  );
}
