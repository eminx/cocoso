import React from 'react';
import { ChakraProvider, Progress } from '@chakra-ui/react';

import { generateTheme } from '../ui/utils/constants/theme';

function LoaderSSR() {
  const chakraTheme = generateTheme('233');

  return (
    <ChakraProvider theme={chakraTheme}>
      <Progress size="xs" isIndeterminate colorScheme="blue" />
    </ChakraProvider>
  );
}

import {
  ActivitiesList,
  Activity,
  Communities,
  Home,
  GroupsList,
  Group,
  Page,
  ResourcesList,
  Resource,
  WorksList,
  Work,
  UsersList,
  User,
} from './components';

export const AppRoutesSSR = (host) => [
  {
    path: '/',
    element: <Home host={host} />,
  },
  {
    path: '/activities',
    element: <ActivitiesList host={host} />,
  },
  {
    path: '/groups',
    element: <GroupsList host={host} />,
  },
  {
    path: '/resources',
    element: <ResourcesList host={host} />,
  },
  {
    path: '/works',
    element: <WorksList host={host} />,
  },
  {
    path: '/people',
    element: <UsersList host={host} />,
  },
  {
    path: '/communities',
    element: <Communities host={host} />,
  },
  {
    path: '/calendar',
    element: <LoaderSSR />,
  },
  {
    path: '/activities/:activityId/*',
    element: <Activity host={host} />,
  },
  {
    path: '/groups/:groupId/*',
    element: <Group host={host} />,
  },
  {
    path: '/pages/:pageTitle',
    element: <Page host={host} />,
  },
  {
    path: '/resources/:resourceId/*',
    element: <Resource host={host} />,
  },
  {
    path: '/:usernameSlug/works/:workId/*',
    element: <Work host={host} />,
  },
  {
    path: '/:usernameSlug/*',
    element: <User host={host} />,
  },
  {
    path: '/*',
    element: <LoaderSSR />,
  },
];
