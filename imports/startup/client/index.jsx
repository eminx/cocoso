import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onPageLoad } from 'meteor/server-render';
import { Box, Center, ChakraProvider } from '@chakra-ui/react';

import '../i18n';
import AppRoutes from '../../ui/pages/Routes';
import { Signup } from '/imports/ui/pages/auth';
import Setup from '/imports/ui/pages/setup';
import SetupHome from '/imports/ui/pages/setup';
import { call } from '/imports/ui/utils/shared';

onPageLoad(async () => {
  const container = document.getElementById('root');

  const platform = await Meteor.callAsync('getPlatform');
  const currentHost = await call('getCurrentHost');

  if (!platform || !currentHost) {
    const root = createRoot(container);
    root.render(
      <ChakraProvider data-oid="-e9fugn">
        <BrowserRouter data-oid="e:i9rx_">
          <SetupHome data-oid=".64f65-" />
        </BrowserRouter>
      </ChakraProvider>
    );
    return;
  }

  hydrateRoot(
    container,
    <BrowserRouter data-oid="kl-fbs0">
      <AppRoutes data-oid="dfn7kfr" />
    </BrowserRouter>
  );
});
