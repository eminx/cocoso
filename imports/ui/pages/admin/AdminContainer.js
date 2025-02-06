import React, { useContext, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import Bolt from 'lucide-react/dist/esm/icons/bolt';

import { StateContext } from '../../LayoutContainer';
import { Alert } from '../../generic/message';
import AdminSidebar from './AdminMenu';
import Drawer from '../../generic/Drawer';
import getAdminRoutes from './getAdminRoutes';

export default function AdminContainer() {
  const { currentUser, currentHost, isDesktop, role } = useContext(StateContext);
  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();

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
  const routes = getAdminRoutes(menuItems);

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

  const handleItemClick = (item) => {
    if (!currentRoute || !item) {
      return;
    }
    if (item.isMulti) {
      navigate(item.content[0]?.value);
      if (!isDesktop && currentRoute.value.split('/')[0] === item.value.split('/')[0]) {
        setDrawerMenuOpen(false);
      }
      return;
    }
    navigate(item.value);
    if (!isDesktop) {
      setDrawerMenuOpen(false);
    }
  };

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
          <AdminSidebar routes={routes} onItemClick={handleItemClick} />
        </Drawer>
        <Box>
          <Box bg="gray.50" position="relative" p="4">
            <Flex
              align="center"
              direction="column"
              color="gray.800"
              cursor="pointer"
              left="0"
              px="4"
              py="3"
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
          <AdminSidebar routes={routes} onItemClick={handleItemClick} />
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
