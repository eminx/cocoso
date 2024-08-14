import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { onPageLoad } from 'meteor/server-render';
import { createStandaloneToast } from '@chakra-ui/toast';

import '../i18n';
import Routes from '../../ui/pages/Routes';

const { ToastContainer, toast } = createStandaloneToast();
export { toast };

onPageLoad(() => {
  const container = document.getElementById('root');
  // const root = createRoot(container);
  hydrateRoot(
    container,

    // root.render(
    <>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>

      <ToastContainer />
    </>
  );

  // );
});
