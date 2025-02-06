import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Code, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import Bolt from 'lucide-react/dist/esm/icons/bolt';

import { StateContext } from '../../LayoutContainer';
import { Alert } from '../../generic/message';
import Settings from './Settings';
import AdminSidebar from './AdminMenu';
import MenuSettings from './MenuSettings';
import ColorPicker from './ColorPicker';
import Members from './Members';
import Emails from './Emails';
import EmailNewsletter from './EmailNewsletter';
import Drawer from '../../generic/Drawer';
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
  const { currentUser, currentHost, isDesktop, role } = useContext(StateContext);
  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const location = useLocation();

  useEffect(() => {
    setDrawerMenuOpen(false);
  }, [location?.pathname]);

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

  if (!isDesktop) {
    return (
      <Box bg="gray.100" minH="100vh">
        <Drawer
          bg="white"
          isOpen={drawerMenuOpen}
          bodyProps={{ p: '0' }}
          placement="left"
          size="xs"
          title={t('menulabel')}
          titleColor="brand.900"
          onClose={() => setDrawerMenuOpen(false)}
        >
          <AdminSidebar routes={routes} />
        </Drawer>
        <Box>
          <Box bg="gray.50" position="relative" p="4">
            <Flex
              align="center"
              direction="column"
              color="gray.800"
              cursor="pointer"
              left="0"
              p="3"
              position="absolute"
              top="0"
              onClick={() => setDrawerMenuOpen(true)}
            >
              <Bolt />
              <Text fontSize="xs">{t('menu.title')}</Text>
            </Flex>
            <Heading flexGrow="0" color="gray.900" size="md" textAlign="center">
              {t('panel')}
            </Heading>
          </Box>
          <Box p="6">
            <Heading mb="8">{currentRoute?.label}</Heading>
            <button onClick={() => setDrawerMenuOpen(true)}>Menu</button>
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
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="gray.100" minH="100vh">
      <SimpleGrid columns={2} h="100%" templateColumns="320px 50%">
        <Box>
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
