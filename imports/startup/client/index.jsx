import React, { Suspense } from 'react';
import { onPageLoad } from 'meteor/server-render';
import { hydrateRoot } from 'react-dom/client';
import { Progress } from '@chakra-ui/react';

import '../i18n';
import Routes from '../../ui/pages/Routes';

onPageLoad(() => {
  const container = document.getElementById('render-target');

  hydrateRoot(
    container,
    <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
      <Routes />
    </Suspense>
  );
});
