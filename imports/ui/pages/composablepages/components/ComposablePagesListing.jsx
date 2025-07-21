import React from 'react';
import { Link } from 'react-router-dom';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';
import { Trans } from 'react-i18next';
import dayjs from 'dayjs';

import { Box, Flex, Link as CLink, Tag } from '/imports/ui/core';

import Boxling from '/imports/ui/pages/admin/Boxling';
import { Heading, Text } from '/imports/ui/core';

function formatDate(date) {
  return dayjs(date).format('MMM D, YYYY');
}

function getItemFootnote(composablePage) {
  return (
    <Text color="gray.700" size="sm">
      <Trans i18nKey="common:message.createdBy" />{' '}
      {composablePage.authorName || composablePage.authorUsername}{' '}
      {dayjs(composablePage.creationDate).format('MMMM D, YYYY')}
      {composablePage.latestUpdateAuthorUsername ? (
        <>
          {'; '}
          <Trans i18nKey="common:message.updatedBy" />{' '}
          {composablePage.latestUpdateAuthorUsername +
            ' ' +
            dayjs(composablePage.latestUpdate).format('MMM D, YYYY')}
        </>
      ) : (
        ''
      )}
    </Text>
  );
}

export default function ComposablePagesListing({ composablePageTitles }) {
  return (
    <Box css={{ flexGrow: '1' }}>
      <Box py="4">
        {composablePageTitles.length > 0 ? (
          <Text size="lg" css={{ marginBottom: '1rem', fontWeight: 'bold' }}>
            <Trans i18nKey="admin:composable.existing" />:
          </Text>
        ) : (
          <Text size="lg" css={{ marginBottom: '1rem', fontWeight: 'bold' }}>
            <Trans i18nKey="admin:composable.none" />
          </Text>
        )}
      </Box>

      {composablePageTitles.map((composablePage) => (
        <Link
          key={composablePage._id}
          to={`/admin/composable-pages/${composablePage._id}`}
        >
          <Boxling mb="4">
            <Flex justifyContent="space-between" w="100%">
              <Box>
                <CLink as="span">
                  <Heading color="blue.600" size="md">
                    {composablePage.title}
                  </Heading>
                </CLink>
                <Box pt="2">{getItemFootnote(composablePage)}</Box>
              </Box>
              <Box>
                <Tag
                  colorScheme={composablePage.isPublished ? 'green' : 'orange'}
                  ml="4"
                  size="sm"
                  variant="solid"
                >
                  <Trans
                    i18nKey={`admin:composable.toolbar.${
                      composablePage.isPublished ? 'published' : 'unpublished'
                    }`}
                  />
                </Tag>
              </Box>
            </Flex>
          </Boxling>
        </Link>
      ))}
    </Box>
  );
}
