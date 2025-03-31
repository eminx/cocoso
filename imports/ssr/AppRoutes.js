import React from 'react';
import { ChakraProvider, Progress } from '@chakra-ui/react';

import generateTheme from '../ui/utils/constants/theme';

import {
  ActivityList,
  Activity,
  Communities,
  Home,
  GroupList,
  Group,
  Page,
  ResourceList,
  Resource,
  WorkList,
  Work,
  UserList,
  User,
} from './components';

function LoaderSSR() {
  const chakraTheme = generateTheme('233');

  return (
    <ChakraProvider theme={chakraTheme}>
      <Progress size="xs" isIndeterminate colorScheme="blue" />
    </ChakraProvider>
  );
}

const AppRoutesSSR = (host, sink) => {
  const props = {
    host,
    sink,
  };

  return [
    {
      path: '/',
      element: <Home {...props} />,
    },
    {
      path: '/activities',
      element: <ActivityList {...props} />,
    },
    {
      path: '/groups',
      element: <GroupList {...props} />,
    },
    {
      path: '/resources',
      element: <ResourceList {...props} />,
    },
    {
      path: '/works',
      element: <WorkList {...props} />,
    },
    {
      path: '/people',
      element: <UserList {...props} />,
    },
    {
      path: '/communities',
      element: <Communities {...props} />,
    },
    {
      path: '/calendar',
      element: <LoaderSSR />,
    },
    {
      path: '/activities/:activityId/*',
      element: <Activity {...props} />,
    },
    {
      path: '/groups/:groupId/*',
      element: <Group {...props} />,
    },
    {
      path: '/pages/:pageTitle',
      element: <Page {...props} />,
    },
    {
      path: '/info/:pageTitle',
      element: <Page {...props} />,
    },
    {
      path: '/resources/:resourceId/*',
      element: <Resource {...props} />,
    },
    {
      path: '/:usernameSlug/works/:workId/*',
      element: <Work {...props} />,
    },
    {
      path: '/:usernameSlug/*',
      element: <User {...props} />,
    },
    {
      path: '/*',
      element: <LoaderSSR />,
    },
  ];
};

export default AppRoutesSSR;
