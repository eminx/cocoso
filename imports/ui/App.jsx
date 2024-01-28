import React, { Suspense } from 'react';
import Routes from './pages/Routes';
import '/imports/startup/i18n';

import { MainLoader } from './components/SkeletonLoaders';

export default function () {
  return (
    <Suspense fallback={<MainLoader />}>
      <Routes />
    </Suspense>
  );
}
