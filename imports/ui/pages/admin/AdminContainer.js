import React, { lazy, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Heading, SimpleGrid } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import { Alert } from '../../generic/message';
import Settings from './Settings';
import AdminSideBar from './AdminSideBar';

const MenuSettings = lazy(() => import('./MenuSettings'));
const ColorPicker = lazy(() => import('./ColorPicker'));
const Members = lazy(() => import('./Members'));
const Emails = lazy(() => import('./Emails'));
const EmailNewsletter = lazy(() => import('./EmailNewsletter'));
const Categories = lazy(() => import('./Categories'));

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

  const routes = [
    {
      label: t('settings.title'),
      value: 'settings',
      isMulti: true,
      content: [
        {
          label: t('organization.title'),
          value: 'settings/organization/*',
          content: <Settings />,
        },
        {
          label: t('menu.title'),
          value: 'settings/menu',
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
      value: 'features/*',
      content: <Box />,
    },
    {
      label: t('users.title'),
      value: 'users/*',
      content: <Members />,
    },
    {
      label: t('emails.title'),
      value: 'emails',
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
  let currentRoute;
  routes.forEach((r) => {
    if (r.isMulti) {
      currentRoute = r.content.find((rs) => pathname.includes(rs?.value?.split('/')[1]));
    } else if (pathname.includes(r?.value?.split('/')[0])) {
      currentRoute = r;
    }
  });

  return (
    <Box bg="blueGray.100" minH="100vh">
      <SimpleGrid columns={2} templateColumns="320px 40%">
        <Box bg="white">
          <AdminSideBar routes={routes} />
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
