import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { onPageLoad } from 'meteor/server-render';
import { createRoot } from 'react-dom/client';
import { Progress } from '@chakra-ui/react';

import '../i18n';
import Routes from '../../ui/pages/Routes';

// const browserHistory = createMemoryHistory();

onPageLoad(() => {
  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(
    <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Suspense>
  );
});
