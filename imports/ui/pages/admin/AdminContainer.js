import React, { useCallback, useContext, useState } from 'react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Bolt from 'lucide-react/dist/esm/icons/bolt';
import Eye from 'lucide-react/dist/esm/icons/eye';

import {
  Alert,
  Box,
  Center,
  Drawer,
  Flex,
  Heading,
  Grid,
  Loader,
  Text,
} from '/imports/ui/core';
import { StateContext } from '/imports/ui/LayoutContainer';
import EditProfile from '/imports/ui/pages/profile/EditProfile';

import AdminMenu from './AdminMenu';
import getAdminRoutes from './getAdminRoutes';

function RouteRenderer({ routes, currentRoute }) {
  const { currentUser } = useContext(StateContext);
  if (!routes) {
    return null;
  }

  const EditProfileRoute = currentUser && (
    <Route key="my-profile" path="/my-profile/*" element={<EditProfile />} />
  );
  return (
    <Box p="6">
      <Box mb="8">
        <Heading mb="2">{currentRoute?.label}</Heading>
        {currentRoute?.description && (
          <Heading css={{ fontWeight: '300' }} size="sm">
            {currentRoute?.description}
          </Heading>
        )}
      </Box>

      <Routes>
        {routes?.map((route) =>
          route.isMulti ? (
            route.content.map((routeSub) => (
              <>
                <Route
                  key={routeSub.value}
                  path={routeSub.value}
                  element={routeSub.content}
                />
              </>
            ))
          ) : (
            <Route
              key={route.value}
              path={route.value}
              element={route.content}
            />
          )
        )}
        {EditProfileRoute}
      </Routes>
    </Box>
  );
}

const iconContainerProps = {
  align: 'center',
  direction: 'column',
  color: 'bluegray.800',
  cursor: 'pointer',
  gap: '0',
  p: '2',
};

export default function AdminContainer() {
  const { currentUser, currentHost, isDesktop, role } =
    useContext(StateContext);
  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const [ta] = useTranslation('accounts');

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = currentHost?.settings?.menu;
  const isAdmin = role === 'admin';
  const routes = isAdmin ? getAdminRoutes(menuItems) : null;

  const pathname = location?.pathname;

  const getCurrentRoute = useCallback(() => {
    if (!routes) {
      return null;
    }
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
      label: ta('profile.settings'),
      value: 'my-profile',
    });

    return allRoutes.find((r) => pathname.includes(r.value));
  }, [routes, pathname]);

  const currentRoute = getCurrentRoute();

  const handleItemClick = (item) => {
    if (!item) {
      return;
    }
    if (item.isMulti) {
      navigate(item.content[0]?.value);
      if (
        !isDesktop &&
        currentRoute?.value?.split('/')[0] === item?.value?.split('/')[0]
      ) {
        setDrawerMenuOpen(false);
      }
      return;
    }
    navigate(item.value);
    if (!isDesktop) {
      setDrawerMenuOpen(false);
    }
  };

  if (!currentHost) {
    return <Loader />;
  }

  if (!currentUser) {
    return (
      <Center p="12">
        <Alert>{tc('message.access.deny')}</Alert>
      </Center>
    );
  }

  if (!isDesktop) {
    return (
      <Box bg="bluegray.100" minH="100vh">
        <Drawer
          open={drawerMenuOpen}
          noPadding
          position="left"
          size="sm"
          title={t('menulabel')}
          onClose={() => setDrawerMenuOpen(false)}
        >
          <AdminMenu routes={routes} onItemClick={handleItemClick} />
        </Drawer>

        <Box>
          <Flex
            align="center"
            bg="bluegray.50"
            justify="space-between"
            w="100%"
          >
            <Flex
              {...iconContainerProps}
              onClick={() => setDrawerMenuOpen(true)}
            >
              <Bolt />
              <Text fontSize="xs">{t('menu.title')}</Text>
            </Flex>
            <Heading
              flexGrow="1"
              color="bluegray.900"
              size="md"
              textAlign="center"
            >
              {isAdmin ? t('panel') : ta('profile.settings')}
            </Heading>
            <Link to="/">
              <Flex {...iconContainerProps}>
                <Eye />
                <Text fontSize="xs">{t('admin:site')}</Text>
              </Flex>
            </Link>
          </Flex>

          <RouteRenderer routes={routes} currentRoute={currentRoute} />
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="bluegray.100" minH="100vh">
      <Grid h="100%" templateColumns="320px 50%">
        <Box>
          <AdminMenu routes={routes} onItemClick={handleItemClick} />
        </Box>

        <RouteRenderer routes={routes} currentRoute={currentRoute} />
      </Grid>
    </Box>
  );
}
