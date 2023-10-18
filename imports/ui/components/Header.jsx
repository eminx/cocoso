import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Flex, Heading as CHeading, HStack, Image } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import NewButton from './NewButton';
import MenuDrawer from './MenuDrawer';

function Header({ isSmallerLogo }) {
  const { canCreateContent, currentHost, currentUser, isDesktop, platform, role } =
    useContext(StateContext);
  const [tc] = useTranslation('common');

  const { menu } = currentHost?.settings;
  const menuItems = menu.filter((item) => item.isVisible);

  if (platform?.showCommunitiesInMenu) {
    menuItems.push({
      name: 'communities',
      label: tc('platform.communities'),
    });
  }

  let logoClass = 'logo';
  if (isSmallerLogo || !isDesktop) {
    logoClass += ' smaller-logo';
  }

  const isAdmin = currentUser && role === 'admin';

  return (
    <Box p={isDesktop ? '4' : '2'} w="100%">
      <Flex w="100%" align="center" justify="space-between">
        <Box>
          <Link to="/">
            <Box pl={isDesktop ? '4' : '2'}>
              <Image className={logoClass} fit="contain" src={currentHost && currentHost.logo} />
            </Box>
          </Link>
        </Box>
        <HStack align="center" justify="flex-end" p="4" spacing="4" zIndex="1403">
          {currentUser && (
            <NewButton
              canCreateContent={canCreateContent}
              currentHost={currentHost}
              isAdmin={isAdmin}
            />
          )}
          <UserPopup currentUser={currentUser} />
          {!isDesktop && (
            <MenuDrawer currentHost={currentHost} isDesktop={false} platform={platform} />
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

function Heading() {
  const history = useHistory();
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
    <Box>
      <CHeading color="gray.800" fontFamily="'Raleway', sans-serif" size="lg">
        {activeMenuItem?.label}
      </CHeading>
    </Box>
  );
}

export { Heading };
export default Header;
