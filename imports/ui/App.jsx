import React, { Suspense } from 'react';
import { setConfiguration } from 'react-grid-system';
import { Progress } from '@chakra-ui/react';

/* eslint-disable-next-line import/extensions, import/no-absolute-path */
import '/imports/startup/i18n';
import Routes from './pages/Routes';

setConfiguration({ maxScreenClass: 'xl' });

export default () => (
  <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
    <Routes />
  </Suspense>
);
