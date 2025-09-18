import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { onPageLoad } from 'meteor/server-render';

import AppRoutes from '/imports/ui/pages/Routes';
import SetupHome from '/imports/ui/pages/setup';

import '../i18n';

onPageLoad(async () => {
  const container = document.getElementById('root');

  const platform = await Meteor.callAsync('getPlatform');

  if (!platform) {
    const root = createRoot(container);
    root.render(
      <BrowserRouter>
        <SetupHome />
      </BrowserRouter>
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
