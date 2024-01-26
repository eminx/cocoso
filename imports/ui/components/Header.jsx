import React, { useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading as CHeading,
  HStack,
  Image,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import MenuDrawer from './MenuDrawer';
import UserPopupAdmin from './UserPopupAdmin';
import UserPopup from './UserPopup';

const getRoute = (item, index) => {
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

function Header({ isSmallerLogo }) {
  const { currentHost, currentUser, isDesktop, platform, role } = useContext(StateContext);
  const [tc] = useTranslation('common');
  const location = useLocation();
  const pathname = location?.pathname;

  const { isHeaderMenu, menu } = currentHost?.settings;
  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  if (platform?.showCommunitiesInMenu && currentHost?.isPortalHost) {
    menuItems.push({
      name: 'communities',
      label: tc('platform.communities'),
      route: '/communities',
    });
  }

  let logoClass = 'logo';
  if (isSmallerLogo || !isDesktop) {
    logoClass += ' smaller-logo';
  }

  const isAdmin = currentUser && role === 'admin';

  if (!currentHost) {
    return null;
  }

  const isCurrentPage = (item) => {
    if (item.name === 'info') {
      const pathSplitted = pathname.split('/');
      return pathSplitted && pathSplitted[1] === 'pages';
    }
    return item.route === pathname;
  };

  return (
    <Box px="2" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        {isDesktop && <Box w="56px" />}
        <Box pt="3" px="2">
          <Link to="/">
            <Box>
              {currentHost.logo ? (
                <Image className={logoClass} fit="contain" mt="2" src={currentHost.logo} />
              ) : (
                <Box>
                  <CHeading color="brand.800" fontWeight="light">
                    {currentHost.settings?.name}
                  </CHeading>
                  {isAdmin && (
                    <Link to="/admin/settings/organization">
                      <Button as="span" colorScheme="orange" fontWeight="light" variant="link">
                        Add logo
                      </Button>
                    </Link>
                  )}
                </Box>
              )}
            </Box>
          </Link>
        </Box>

        <HStack align="center" justify="flex-end" p="2" pt="4" spacing="4">
          {platform && !platform.isFederationLayout && <UserPopup />}
          {currentUser && isAdmin && <UserPopupAdmin />}
          {!isDesktop && (
            <MenuDrawer currentHost={currentHost} isDesktop={false} platform={platform} />
          )}
        </HStack>
      </Flex>
      <Center>
        {isDesktop && isHeaderMenu && (
          <HStack alignItems="flex-start" p="6" wrap="wrap">
            {menuItems.map((item) => {
              const isCurrentPageLabel = isCurrentPage(item);
              return (
                <Link key={item.name} to={item.route}>
                  <Box px="2">
                    <Text
                      as="span"
                      _hover={!isCurrentPageLabel && { borderBottom: '2px dashed' }}
                      borderBottom={isCurrentPageLabel ? '2px solid' : '2px transparent'}
                      color={isCurrentPageLabel ? 'gray.800' : 'brand.500'}
                      fontFamily="Raleway, Sarabun, sans"
                      fontWeight="bold"
                    >
                      {item.label}
                    </Text>
                  </Box>
                </Link>
              );
            })}
          </HStack>
        )}
      </Center>
    </Box>
  );
}

function Heading({ title, numberOfItems }) {
  const history = useHistory();
  const [tc] = useTranslation('common');

  const pathname = history.location.pathname;
  const isCurrentPage = (name) => {
    if (name === 'info') {
      return pathname.substring(0, 6) === '/pages';
    }
    return name === pathname.substring(1, pathname.length);
  };

  const { currentHost } = useContext(StateContext);

  const { menu } = currentHost?.settings;
  const menuItems = menu?.filter((item) => item.isVisible);

  const activeMenuItem = menuItems.find((item) => isCurrentPage(item.name));

  return (
    <Flex>
      <CHeading as="h1" fontFamily="'Raleway', sans-serif" size="lg">
        {title || activeMenuItem?.label}{' '}
        {/* {numberOfItems > 0 && (
          <Text as="span" fontSize="xs">
            {numberOfItems} {tc('labels.items')}
          </Text>
        )} */}
      </CHeading>
    </Flex>
  );
}

export { Heading };
export default Header;
