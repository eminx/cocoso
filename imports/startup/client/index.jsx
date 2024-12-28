import { Meteor } from 'meteor/meteor';
import React from 'react';
// import { hydrateRoot } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
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
  const root = createRoot(container);

  const platform = await Meteor.callAsync('getPlatform');
  const currentHost = await call('getCurrentHost');

  if (!platform || !currentHost) {
    root.render(
      <>
        <ChakraProvider>
          <BrowserRouter>
            <SetupHome />
          </BrowserRouter>
        </ChakraProvider>
      </>
    );
    return;
  }

  root.render(
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
});
