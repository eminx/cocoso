import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Box, Link as CLink, Text } from '/imports/ui/core';

import Template from '../layout/Template';

export default function NotFoundPage() {
  const [t] = useTranslation('common');

  return (
    <Template>
      <Box m="4" p="2">
        <Text textAlign="center" size="xl">
          404
        </Text>
      </Box>
      <Box m="4" p="2">
        <Text textAlign="center" fontWeight="bold">
          {t('labels.notfound.info')}
        </Text>

        <Box mt="6">
          <Text textAlign="center">
            <Link to="/">
              <CLink>{t('labels.notfound.gohome')}</CLink>
            </Link>
          </Text>
        </Box>
      </Box>
    </Template>
  );
}
