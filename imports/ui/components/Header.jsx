import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import renderHTML from 'react-render-html';

import { StateContext } from '../LayoutContainer';
import MenuDrawer from './MenuDrawer';
import UserPopupAdmin from './UserPopupAdmin';
import UserPopup from './UserPopup';
import ConfirmModal from './ConfirmModal';

const getRoute = (item, index) => {
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

function Header({ isSmallerLogo }) {
  const { currentHost, currentUser, isDesktop, platform, role } = useContext(StateContext);
  const [tc] = useTranslation('common');

  const isHeaderMenu = currentHost?.settings?.isHeaderMenu;
  const menu = currentHost?.settings?.menu;

  const menuItems =
    menu &&
    menu
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

  const isFederationLayout = platform && platform.isFederationLayout;
  const isPortalHost = currentHost?.isPortalHost;

  return (
    <Box px="2" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between" mb="2">
        <Box w="120px">
          {!isPortalHost && isFederationLayout && (
            <TopLeftFederatinLogoMenu currentHost={currentHost} />
          )}
        </Box>

        <Box p="2">
          <Box>
            {currentHost.logo ? (
              <Link to="/">
                <Image className={logoClass} fit="contain" src={currentHost.logo} />
              </Link>
            ) : (
              <Box>
                <Link to="/">
                  <CHeading
                    color="brand.800"
                    fontWeight="400"
                    fontFamily="Raleway, Sarabun, sans-serif"
                  >
                    {currentHost.settings?.name}
                  </CHeading>
                </Link>
                {isAdmin && (
                  <Center>
                    <Link to="/admin/settings/organization">
                      <Button as="span" colorScheme="orange" fontWeight="light" variant="link">
                        Add logo
                      </Button>
                    </Link>
                  </Center>
                )}
              </Box>
            )}
          </Box>
        </Box>

        <HStack align="flex-start" justify="flex-end" p="2" pt="4" spacing="2" w="120px">
          {currentUser && isAdmin && <UserPopupAdmin />}
          {!currentUser && <LoginSignupLinks />}
          {(!isDesktop || !isHeaderMenu) && (
            <MenuDrawer currentHost={currentHost} isDesktop={isDesktop} platform={platform} />
          )}
          {currentUser && <UserPopup />}
        </HStack>
      </Flex>

      {isDesktop && isHeaderMenu && <WrappedMenu menuItems={menuItems} />}
    </Box>
  );
}

const linkButtonProps = {
  as: 'span',
  color: 'brand.500',
  fontWeight: 'normal',
  size: 'sm',
  variant: 'link',
};

function LoginSignupLinks() {
  const [tc] = useTranslation('common');

  return (
    <Flex wrap="wrap" justify="flex-end" mt="-1" pl="4" pr="2">
      <Link to="/login">
        <Button {...linkButtonProps}>{tc('menu.guest.login')}</Button>
      </Link>

      <Link to="/register">
        <Button {...linkButtonProps} ml="4">
          {tc('menu.guest.register')}
        </Button>
      </Link>
    </Flex>
  );
}

export function WrappedMenu({ menuItems }) {
  const location = useLocation();
  const pathname = location?.pathname;

  const isCurrentPage = (item) => {
    const pathSplitted = pathname.split('/');
    if (item.name === 'info') {
      return pathSplitted && pathSplitted[1] === 'pages';
    }
    return pathSplitted.includes(item.name);
  };

  return (
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
  );
}

function TopLeftFederatinLogoMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentHost, platform } = useContext(StateContext);

  return (
    <>
      <Box ml="2" onClick={() => setIsOpen(true)}>
        <Image
          fit="contain"
          src="https://samarbetet.s3.eu-central-1.amazonaws.com/emin/adaptive-icon.png"
          w="64px"
          h="64px"
        />
      </Box>

      <Box pl="2">
        <ConfirmModal
          confirmText="Continue to the Portal App"
          isCentered
          scrollBehavior="inside"
          size="md"
          title="Samarbetet Federation"
          visible={isOpen}
          onConfirm={() => (window.location.href = `https://${platform.portalHost}`)}
          onCancel={() => setIsOpen(false)}
        >
          <Box className="text-content">{renderHTML(platform.footer)}</Box>
        </ConfirmModal>
      </Box>
    </>
  );
}

export default Header;
