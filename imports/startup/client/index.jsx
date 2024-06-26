import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { onPageLoad } from 'meteor/server-render';
import { createRoot } from 'react-dom/client';
import { createStandaloneToast } from '@chakra-ui/toast';

import '../i18n';
import Routes from '../../ui/pages/Routes';
import { MainLoader } from '../../ui/components/SkeletonLoaders';

const { ToastContainer, toast } = createStandaloneToast();
export { toast };

onPageLoad(() => {
  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(
    <>
      <Suspense fallback={<MainLoader />}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Suspense>

      <ToastContainer />
    </>
  );
});
