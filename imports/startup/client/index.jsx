import React, { Suspense } from 'react';
import { onPageLoad } from 'meteor/server-render';
import { hydrate } from 'react-dom';
import { Progress } from '@chakra-ui/react';

import '../i18n';
import Routes from '../../ui/pages/Routes';

onPageLoad(() => {
  hydrate(
    <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
      <Routes />
    </Suspense>,
    document.getElementById('render-target')
  );
});
