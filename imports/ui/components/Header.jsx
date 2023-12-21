import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Button, Flex, Heading as CHeading, HStack, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import MenuDrawer from './MenuDrawer';
import UserPopupAdmin from './UserPopupAdmin';
import UserPopup from './UserPopup';

function Header({ isSmallerLogo }) {
  const { currentHost, currentUser, isDesktop, platform, role } = useContext(StateContext);
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

  if (!currentHost) {
    return null;
  }

  return (
    <Box px="2" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Box py={isDesktop ? '4' : '3'}>
          <Link to="/">
            <Box pl={isDesktop ? '4' : '2'}>
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
          {/* {platform && !platform.isFederationLayout && !currentUser && <LoginHandler />} */}
          {!isDesktop && (
            <MenuDrawer currentHost={currentHost} isDesktop={false} platform={platform} />
          )}
        </HStack>
      </Flex>
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
    <Flex mr="4">
      <CHeading color="gray.800" fontFamily="'Raleway', sans-serif" size="lg">
        {title || activeMenuItem?.label}{' '}
        {numberOfItems > 0 && (
          <Text as="span" fontSize="xs">
            {numberOfItems} {tc('labels.items')}
          </Text>
        )}
      </CHeading>
    </Flex>
  );
}

export { Heading };
export default Header;
