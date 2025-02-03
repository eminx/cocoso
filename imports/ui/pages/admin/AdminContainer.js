import React, { useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Code, Heading, SimpleGrid, Text } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import { Alert } from '../../generic/message';
import Settings from './Settings';
import AdminSidebar from './AdminSidebar';
import MenuSettings from './MenuSettings';
import ColorPicker from './ColorPicker';
import Members from './Members';
import Emails from './Emails';
import EmailNewsletter from './EmailNewsletter';
import Categories from './Categories';
import {
  ActivitiesAdmin,
  CalendarAdmin,
  CommunitiesAdmin,
  GroupsAdmin,
  PagesAdmin,
  PeopleAdmin,
  ResourcesAdmin,
  WorksAdmin,
} from './features';

export default function AdminContainer() {
  const { currentUser, currentHost, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const location = useLocation();

  if (!currentHost) {
    return null;
  }

  if (!currentUser || role !== 'admin') {
    return (
      <Center>
        <Alert>{tc('message.access.deny')}</Alert>
      </Center>
    );
  }

  const menuItems = currentHost.settings?.menu;
  const getMenuLabel = (key) => (
    <Text as="span">
      {menuItems?.find((item) => item.name === key)?.label}
      <Code fontSize="xs" ml="2">
        /{key}
      </Code>
    </Text>
  );

  const routes = [
    {
      label: t('settings.title'),
      value: 'settings',
      isMulti: true,
      content: [
        {
          label: t('info.label'),
          value: 'settings/organization/*',
          content: <Settings />,
        },
        {
          label: t('menu.title'),
          value: 'settings/menu/*',
          content: <MenuSettings />,
        },
        {
          label: t('settings.tabs.color'),
          value: 'settings/color',
          content: <ColorPicker />,
        },
      ],
    },
    {
      label: t('features.title'),
      value: 'features',
      isMulti: true,
      content: [
        {
          label: getMenuLabel('activities'),
          value: 'features/activities',
          content: <ActivitiesAdmin />,
        },
        {
          label: getMenuLabel('calendar'),
          value: 'features/calendar',
          content: <CalendarAdmin />,
        },
        {
          label: (
            <Text as="span">
              {tc('platform.communities')}{' '}
              <Code fontSize="xs" ml="2">
                /communities
              </Code>
            </Text>
          ),
          value: 'features/communities',
          content: <CommunitiesAdmin />,
        },
        {
          label: getMenuLabel('groups'),
          value: 'features/groups',
          content: <GroupsAdmin />,
        },
        {
          label: getMenuLabel('info'),
          value: 'features/pages',
          content: <PagesAdmin />,
        },
        {
          label: getMenuLabel('people'),
          value: 'features/people',
          content: <PeopleAdmin />,
        },
        {
          label: getMenuLabel('resources'),
          value: 'features/resources',
          content: <ResourcesAdmin />,
        },
        {
          label: getMenuLabel('works'),
          value: 'features/works/*',
          content: <WorksAdmin />,
        },
      ],
    },
    {
      label: t('users.title'),
      value: 'users/*',
      content: <Members />,
    },
    {
      label: t('emails.title'),
      value: 'emails/*',
      content: <Emails />,
    },
    {
      label: t('newsletter.title'),
      value: 'email-newsletter',
      content: <EmailNewsletter />,
    },
    {
      label: t('categories.title'),
      value: 'categories',
      content: <Categories />,
    },
  ];

  const pathname = location?.pathname;
  const getCurrentRoute = () => {
    const allRoutes = [];
    routes.forEach((item) => {
      if (item.isMulti) {
        item.content.forEach((itemSub) => {
          allRoutes.push({
            ...itemSub,
            value: itemSub.value.replace('*', ''),
          });
        });
        return;
      }
      allRoutes.push({
        ...item,
        value: item.value.replace('*', ''),
      });
    });

    return allRoutes.find((r) => pathname.includes(r.value));
  };

  const currentRoute = getCurrentRoute();

  return (
    <Box bg="blueGray.100" minH="100vh">
      <SimpleGrid columns={2} templateColumns="320px 40%">
        <Box bg="white">
          <AdminSidebar routes={routes} />
        </Box>
        <Box p="8">
          <Heading mb="8">{currentRoute?.label}</Heading>
          <Routes>
            {routes.map((route) =>
              route.isMulti ? (
                route.content.map((routeSub) => (
                  <Route key={routeSub.value} path={routeSub.value} element={routeSub.content} />
                ))
              ) : (
                <Route key={route.value} path={route.value} element={route.content} />
              )
            )}
          </Routes>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
