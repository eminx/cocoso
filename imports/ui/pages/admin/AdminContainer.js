import React, { useMemo, useState } from 'react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Outlet,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import Bolt from 'lucide-react/dist/esm/icons/bolt';
import Eye from 'lucide-react/dist/esm/icons/eye';
import { useAtomValue } from 'jotai';

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
import {
  currentHostAtom,
  currentUserAtom,
  isDesktopAtom,
  roleAtom,
} from '/imports/state';
// import EditProfile from '/imports/ui/pages/profile/EditProfile';

import AdminMenu from './AdminMenu';
import getAdminRoutes from './getAdminRoutes';

const iconContainerProps = {
  align: 'center',
  direction: 'column',
  color: 'bluegray.800',
  cursor: 'pointer',
  gap: '0',
  p: '2',
};

export default function AdminContainer({ Host, ...props }) {
  const currentHost = Host || useAtomValue(currentHostAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const isDesktop = useAtomValue(isDesktopAtom);
  const role = useAtomValue(roleAtom);

  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');
  const [ta] = useTranslation('accounts');
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = currentHost?.settings?.menu;
  const isAdmin = role === 'admin';
  const routes = isAdmin ? getAdminRoutes(menuItems) : [];

  const pathname = location?.pathname;

  const getCurrentRoute = () => {
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
  };

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

  if (!isDesktop) {
    return (
      <Box bg="bluegray.100" css={{ minHeight: '100vh' }}>
        <Drawer
          open={drawerMenuOpen}
          noPadding
          position="left"
          size="sm"
          title={t('menulabel')}
          onClose={() => setDrawerMenuOpen(false)}
        >
          <AdminMenu
            currentHost={currentHost}
            routes={routes}
            onItemClick={handleItemClick}
          />
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
              color="bluegray.900"
              size="md"
              textAlign="center"
              css={{
                flexGrow: '1',
              }}
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

          <Outlet />
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="bluegray.100" css={{ minHeight: '100vh' }}>
      <Grid h="100%" templateColumns="320px 50%">
        <Box>
          <AdminMenu
            currentHost={currentHost}
            routes={routes}
            onItemClick={handleItemClick}
          />
        </Box>

        <Box p="6">
          <Box mb="8">
            <Heading mb="2">{currentRoute?.label}</Heading>

            {currentRoute?.description && (
              <Heading css={{ fontWeight: '300' }} size="sm">
                {currentRoute?.description}
              </Heading>
            )}
          </Box>

          <Outlet />
        </Box>
      </Grid>
    </Box>
  );
}
