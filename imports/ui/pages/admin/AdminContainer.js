import React, { lazy, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Heading, SimpleGrid } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import ListMenu from '../../generic/ListMenu';
import { Alert } from '../../generic/message';
import { adminMenu, superadminMenu } from '../../utils/constants/general';
import Settings from './Settings';

const Members = lazy(() => import('./Members'));
const Emails = lazy(() => import('./Emails'));
const EmailNewsletter = lazy(() => import('./EmailNewsletter'));
const Categories = lazy(() => import('./Categories'));

function AdminMenu() {
  const { currentHost, currentUser, platform } = useContext(StateContext);
  const location = useLocation();
  const [tc] = useTranslation('common');

  const pathname = location?.pathname;
  const isSuperAdmin = currentUser?.isSuperAdmin;
  const isPortalHost = currentHost?.isPortalHost;

  return (
    <Box bg="brand.800" minH="100vh" minW="280px" p="4" position="fixed">
      <Heading color="gray.50" fontStyle="italic" fontWeight="normal" mb="2" mt="4" size="sm">
        {currentHost?.settings?.name}
      </Heading>
      <ListMenu pathname={pathname} list={adminMenu} />

      {isSuperAdmin && isPortalHost && platform && (
        <>
          <Heading color="gray.50" fontStyle="italic" fontWeight="normal" mb="2" mt="6" size="sm">
            {`${platform.name} ${tc('domains.platform')}`}
          </Heading>
          <ListMenu pathname={pathname} list={superadminMenu} />
        </>
      )}
    </Box>
  );
}

export default function AdminContainer() {
  const { currentUser, currentHost, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

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
      label: t('settings.label'),
      value: 'settings/*',
      content: <Settings />,
    },
    {
      label: t('settings.label'),
      value: 'users/*',
      content: <Members />,
    },
    {
      label: t('settings.label'),
      value: 'emails',
      content: <Emails />,
    },
    {
      label: t('settings.label'),
      value: 'email-newsletter',
      content: <EmailNewsletter />,
    },
    {
      label: t('settings.label'),
      value: 'categories',
      content: <Categories />,
    },
  ];

  return (
    <Box minH="100vh">
      <SimpleGrid columns={2} templateColumns="20% 40%">
        <Box>
          <AdminMenu />
        </Box>
        <Box px="8" py="4">
          <Routes>
            {routes.map((route) => (
              <Route key={route.value} path={route.value} element={route.content} />
            ))}
          </Routes>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
