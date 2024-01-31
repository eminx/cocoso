import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading as CHeading,
  HStack,
  Image,
  Show,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import MenuDrawer from './MenuDrawer';
import UserPopupAdmin from './UserPopupAdmin';
import UserPopup from './UserPopup';
import NewButton from './NewButton';

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
    const pathSplitted = pathname.split('/');
    if (item.name === 'info') {
      return pathSplitted && pathSplitted[1] === 'pages';
    }
    return pathSplitted.includes(item.name);
  };

  return (
    <Box px="2" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between" mb="2">
        {isDesktop && (
          <Flex w="120px" pl="2" pt="4">
            {!isHeaderMenu && (
              <MenuDrawer currentHost={currentHost} isDesktop={isDesktop} platform={platform} />
            )}
          </Flex>
        )}
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

        <HStack align="flex-start" justify="flex-end" p="2" pt="4" spacing="4" w="120px">
          <Show breakpoint="(min-width: 520px)">
            {platform && !platform.isFederationLayout && <UserPopup />}
          </Show>
          <NewButton />
          {currentUser && isAdmin && <UserPopupAdmin />}
          {!isDesktop && (
            <MenuDrawer currentHost={currentHost} isDesktop={isDesktop} platform={platform} />
          )}
        </HStack>
      </Flex>
      <Show breakpoint="(max-width: 519px)">
        <Flex justify="flex-end" mt="-2" pr="2">
          <Box>
            <UserPopup />
          </Box>
        </Flex>
      </Show>
      <Show breakpoint="(min-width: 520px)">
        <Box mb={isDesktop ? '0' : '6'}></Box>
      </Show>

      {isDesktop && isHeaderMenu && (
        <Center p="4">
          <HStack alignItems="flex-start" mb="2" wrap="wrap">
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
        </Center>
      )}
    </Box>
  );
}

export default Header;
