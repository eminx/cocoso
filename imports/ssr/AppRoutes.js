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
  // ActivitiesList,
  Activity,
  // Communities,
  // Home,
  // GroupsList,
  Group,
  // ResourcesList,
  Resource,
  // WorksList,
  Work,
  // UsersList,
  // User,
} from './components';

export const AppRoutesSSR = [
  {
    path: '/',
    element: <LoaderSSR />,
  },
  {
    path: '/activities',
    element: <LoaderSSR />,
  },
  {
    path: '/groups',
    element: <LoaderSSR />,
  },
  {
    path: '/resources',
    element: <LoaderSSR />,
  },
  {
    path: '/works',
    element: <LoaderSSR />,
  },
  {
    path: '/people',
    element: <LoaderSSR />,
  },
  {
    path: '/communities',
    element: <LoaderSSR />,
  },
  {
    path: '/calendar',
    element: <LoaderSSR />,
  },
  {
    path: '/activities/:activityId/*',
    element: <Activity />,
  },
  {
    path: '/activities/new',
    element: <LoaderSSR />,
  },
  {
    path: '/groups/:groupId/*',
    element: <Group />,
  },
  {
    path: '/groups/new',
    element: <LoaderSSR />,
  },
  {
    path: '/pages/:pageTitle',
    element: <LoaderSSR />,
  },
  {
    path: '/*',
    element: <LoaderSSR />,
  },
  {
    path: '/resources/:resourceId/*',
    element: <Resource />,
  },
  {
    path: '/:usernameSlug/works/:workId/*',
    element: <Work />,
  },
  {
    path: '/:usernameSlug/*',
    element: <LoaderSSR />,
  },
  {
    path: '/*',
    element: <LoaderSSR />,
  },
];
