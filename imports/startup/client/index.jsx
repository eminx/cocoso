import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
// import { createMemoryHistory } from 'history';
import { onPageLoad } from 'meteor/server-render';
import { createRoot } from 'react-dom/client';

import '../i18n';
import Routes from '../../ui/pages/Routes';
import { MainLoader } from '../../ui/components/SkeletonLoaders';

// const browserHistory = createMemoryHistory();

onPageLoad(() => {
  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(
    <Suspense fallback={<MainLoader />}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Suspense>
  );
});
