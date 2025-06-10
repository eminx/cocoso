import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Center, Link as CLink } from '@chakra-ui/react';
import PlusIcon from 'lucide-react/dist/esm/icons/plus';
import { Trans } from 'react-i18next';

import Boxling from '/imports/ui/pages/admin/Boxling';
import { Heading, Text } from '/imports/ui/core';

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
            <CLink as="span">
              <Heading color="blue.600" size="md">
                {composablePage.title}
              </Heading>
            </CLink>
          </Boxling>
        </Link>
      ))}
    </Box>
  );
}
