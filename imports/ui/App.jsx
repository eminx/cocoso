import React, { Suspense } from 'react';
import Routes from './pages/Routes';
import { setConfiguration } from 'react-grid-system';
import { Progress } from '@chakra-ui/react';

import '/imports/startup/@/i18n';

setConfiguration({ maxScreenClass: 'xl' });

export default function () {
  return (
    <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
      <Routes />
    </Suspense>
  );
}
