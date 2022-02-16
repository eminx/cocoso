import React, { Suspense } from 'react';
import Routes from './pages/Routes';
import { setConfiguration } from 'react-grid-system';
import { Center } from '@chakra-ui/react';

import '/imports/startup/@/i18n';

setConfiguration({ maxScreenClass: 'xl' });

export default function () {
  return (
    <Suspense fallback={<Center>loading i18n ...</Center>}>
      <Routes />
    </Suspense>
  );
}
