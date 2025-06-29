import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Link as CLink,
  Tag,
} from '@chakra-ui/react';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';
import { Trans } from 'react-i18next';
import dayjs from 'dayjs';

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
      {dayjs(composablePage.creationDate).format('MMM D, YYYY')}{' '}
      {composablePage.latestUpdateAuthorUsername ? (
        <>
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

export default function ComposablePagesListing({
  composablePageTitles,
}) {
  return (
    <Box flexGrow={1}>
      <Text
        size="lg"
        css={{ marginBottom: '1rem', fontWeight: 'bold' }}
      >
        <Trans i18nKey="admin:composable.existing" />:
      </Text>

      {composablePageTitles.map((composablePage) => (
        <Link
          key={composablePage._id}
          to={`/admin/composable-pages/${composablePage._id}`}
        >
          <Boxling mb="4">
            <Flex>
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
                  colorScheme={
                    composablePage.isPublished ? 'green' : 'orange'
                  }
                  ml="4"
                  size="sm"
                  variant="solid"
                >
                  <Trans
                    i18nKey={`admin:composable.toolbar.${
                      composablePage.isPublished
                        ? 'published'
                        : 'unpublished'
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
