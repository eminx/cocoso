import React, { Suspense } from 'react';
import Routes from './pages/Routes';
import { setConfiguration } from 'react-grid-system';
setConfiguration({ maxScreenClass: 'xl' });

import '/imports/startup/@/i18n';

export default function () {
  return (
    <Suspense fallback={<p>Still loading i18n...</p>}>
      <Routes />
    </Suspense>
  );
}
