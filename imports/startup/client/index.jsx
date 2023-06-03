import React, { Suspense } from 'react';
import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';
import { hydrate } from 'react-dom';
import { Progress } from '@chakra-ui/react';
import '../i18n';

import App from '../../ui/App';
import Routes from '../../ui/pages/Routes';

// Meteor.startup(() => {
onPageLoad(() => {
  // hydrate(<App />, document.getElementById('render-target'));
  hydrate(
    <Suspense fallback={<Progress size="xs" colorScheme="pink" isIndeterminate />}>
      <Routes />
    </Suspense>,
    document.getElementById('render-target')
  );
});
// });
