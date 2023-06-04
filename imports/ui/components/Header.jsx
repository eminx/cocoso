import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import NewButton from './NewButton';
import MenuDrawer from './MenuDrawer';

function Header({ isSmallerLogo }) {
  const { canCreateContent, currentHost, currentUser, isDesktop, role } = useContext(StateContext);
  const [tc] = useTranslation('common');
  const history = useHistory();

  const { menu } = currentHost?.settings;
  const menuItems = menu.filter((item) => item.isVisible);

  if (currentHost?.isPortalHost) {
    menuItems.push({
      name: 'communities',
      label: tc('platform.communities'),
    });
  }

  const pathname = history.location.pathname;
  const isCurrentPage = (name) => {
    if (name === 'info') {
      return pathname.substring(0, 6) === '/pages';
    }
    return name === pathname.substring(1, pathname.length);
  };

  const activeMenuItem = menuItems.find((item) => isCurrentPage(item.name));

  let logoClass = 'logo';
  if (isSmallerLogo || !isDesktop) {
    logoClass += ' smaller-logo';
  }

  const isAdmin = currentUser && role === 'admin';

  return (
    <Box p={isDesktop ? '4' : '2'} mt={isDesktop || !isSmallerLogo ? '4' : '2'} w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Box>
          <Link to="/">
            <Box pl={isDesktop ? '4' : '2'}>
              <Image className={logoClass} fit="contain" src={currentHost && currentHost.logo} />
            </Box>
          </Link>
        </Box>

        <HStack align="center" justify="flex-end" spacing="4" zIndex="1403">
          <NewButton
            canCreateContent={canCreateContent}
            currentHost={currentHost}
            isAdmin={isAdmin}
          />
          <UserPopup currentUser={currentUser} />
          {!isDesktop && <MenuDrawer currentHost={currentHost} isDesktop={false} />}
        </HStack>
      </Flex>

      {activeMenuItem && (
        <Box pb="2" pt="10" px={isDesktop ? '4' : '2'}>
          <Heading color="gray.800" size="lg">
            <Text as="span" fontWeight="normal">
              {activeMenuItem?.label}
            </Text>
          </Heading>
        </Box>
      )}
    </Box>
  );
}

export default Header;
