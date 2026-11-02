import React from 'react';
import { Link } from 'react-router';
import { Trans } from 'react-i18next';

import { Box, Link as CLink, Text } from '/imports/ui/core';

import Template from '../layout/Template';

export default function NotFoundPage() {
  return (
    <Template>
      <Box m="4" p="2">
        <Text textAlign="center" size="xl">
          404
        </Text>
      </Box>
      <Box m="4" p="2">
        <Text textAlign="center" fontWeight="bold">
          <Trans i18nKey="common:labels.notfound.info">
            What you look for could not be found
          </Trans>
        </Text>

        <Box mt="6">
          <Text textAlign="center">
            <Link to="/">
              <CLink>
                <Trans i18nKey="common:labels.notfound.gohome">
                  Back to home page
                </Trans>
              </CLink>
            </Link>
          </Text>
        </Box>
      </Box>
    </Template>
  );
}
