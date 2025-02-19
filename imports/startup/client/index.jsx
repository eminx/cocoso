import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { onPageLoad } from 'meteor/server-render';
import { ChakraProvider } from '@chakra-ui/react';

import '../i18n';
import AppRoutes from '../../ui/pages/Routes';
import SetupHome from '../../ui/pages/setup';

onPageLoad(async () => {
  const container = document.getElementById('root');

  const platform = await Meteor.callAsync('getPlatform');

  if (!platform) {
    const root = createRoot(container);
    root.render(
      <ChakraProvider>
        <BrowserRouter>
          <SetupHome />
        </BrowserRouter>
      </ChakraProvider>
    );
    return;
  }

  hydrateRoot(
    container,
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
});
