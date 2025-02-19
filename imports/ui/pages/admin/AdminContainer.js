import React, { useContext, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import Bolt from 'lucide-react/dist/esm/icons/bolt';
import Eye from 'lucide-react/dist/esm/icons/eye';

import { StateContext } from '../../LayoutContainer';
import { Alert } from '../../generic/message';
import AdminMenu from './AdminMenu';
import Drawer from '../../generic/Drawer';
import getAdminRoutes from './getAdminRoutes';
import EditProfile from '../profile/EditProfile';

export default function AdminContainer() {
  const { currentUser, currentHost, isDesktop, role } = useContext(StateContext);
  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const [ta] = useTranslation('accounts');

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

    allRoutes.push({
      value: '/my-profile',
      label: ta('profile.settings'),
    });

    return allRoutes.find((r) => pathname.includes(r.value));
  };

  const currentRoute = getCurrentRoute();

  const handleItemClick = (item) => {
    if (!item) {
      return;
    }
    if (item.isMulti) {
      navigate(item.content[0]?.value);
      if (!isDesktop && currentRoute?.value?.split('/')[0] === item?.value?.split('/')[0]) {
        setDrawerMenuOpen(false);
      }
      return;
    }
    navigate(item.value);
    if (!isDesktop) {
      setDrawerMenuOpen(false);
    }
  };

  const iconContainerProps = {
    align: 'center',
    direction: 'column',
    color: 'blueGray.800',
    cursor: 'pointer',
    p: '2',
  };

  const EditProfileRoute = (
    <Route key="my-profile" path="/my-profile/*" element={<EditProfile />} />
  );

  if (!isDesktop) {
    return (
      <Box bg="blueGray.100" minH="100vh">
        <Drawer
          bg="white"
          isOpen={drawerMenuOpen}
          bodyProps={{ p: '0' }}
          headerProps={{ bg: 'blueGray.800' }}
          placement="left"
          size="xs"
          title={t('menulabel')}
          titleColor="brand.50"
          onClose={() => setDrawerMenuOpen(false)}
        >
          <AdminMenu routes={routes} onItemClick={handleItemClick} />
        </Drawer>
        <Box>
          <Flex align="center" bg="blueGray.50" w="100%">
            <Flex {...iconContainerProps} onClick={() => setDrawerMenuOpen(true)}>
              <Bolt />
              <Text fontSize="xs">{t('menu.title')}</Text>
            </Flex>
            <Heading flexGrow="1" color="blueGray.900" size="md" textAlign="center">
              {t('panel')}
            </Heading>
            <Link to="/">
              <Flex {...iconContainerProps}>
                <Eye />
                <Text fontSize="xs">{t('admin:site')}</Text>
              </Flex>
            </Link>
          </Flex>
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
              {EditProfileRoute}
            </Routes>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="blueGray.100" minH="100vh">
      <SimpleGrid columns={2} h="100%" templateColumns="320px 50%">
        <Box>
          <AdminMenu routes={routes} onItemClick={handleItemClick} />
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
            {EditProfileRoute}
          </Routes>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
