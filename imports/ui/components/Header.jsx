import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading as CHeading,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';

const publicSettings = Meteor.settings.public;

import { StateContext } from '../LayoutContainer';
import MenuDrawer from './MenuDrawer';
import UserPopup from './UserPopup';
import ConfirmModal from './ConfirmModal';
import NiceSlider from './NiceSlider';
import { call } from '../utils/shared';

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

  return (
    <Box px="2" w="100%" mb="4">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Box w="120px">
          {isFederationLayout && <TopLeftFederatinLogoMenu currentHost={currentHost} />}
        </Box>

        <Box p="2" mt={isDesktop ? '0' : isFederationLayout ? '42px' : '0'}>
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

        <HStack
          align="flex-start"
          justify="flex-end"
          pt="2"
          position="relative"
          spacing="2"
          w="120px"
        >
          {(!isDesktop || !isHeaderMenu) && (
            <MenuDrawer currentHost={currentHost} isDesktop={isDesktop} platform={platform} />
          )}
          {currentUser && <UserPopup />}
          {!currentUser && <LoginSignupLinks />}
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
  variant: 'link',
};

function LoginSignupLinks() {
  const { currentHost, isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  const isHeaderMenu = currentHost?.settings?.isHeaderMenu;

  return (
    <Flex
      alignContent="flex-end"
      justifyContent="flex-end"
      pl="2"
      position="absolute"
      textAlign="right"
      top={!isDesktop ? '54px' : isHeaderMenu ? '8px' : '66px'}
      width="320px"
      wrap="wrap"
    >
      <Link to="/login" style={{ marginRight: '12px' }}>
        <Button {...linkButtonProps} size={isDesktop ? 'sm' : 'xs'}>
          {tc('menu.guest.login')}
        </Button>
      </Link>

      <Link to="/register">
        <Button {...linkButtonProps} size={isDesktop ? 'sm' : 'xs'}>
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
  const [isMyCommunitiesMenuOpen, setIsMyCommunitiesMenuOpen] = useState(false);
  const { currentHost, currentUser, isDesktop, platform } = useContext(StateContext);
  const [hostInfo, setHostInfo] = useState(null);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  const navigate = useNavigate();

  const handleSetHostInfo = async () => {
    try {
      const info = await call('getPortalHostInfoPage');
      setHostInfo(info);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const isFederationLayout = platform && platform.isFederationLayout;
  const isPortalHost = currentHost?.isPortalHost;

  return (
    <Box position="relative">
      <Box ml="2" className="federation-logo" position="absolute">
        <HStack>
          <Image
            fit="contain"
            src="https://samarbetet.s3.eu-central-1.amazonaws.com/emin/adaptive-icon.png"
            w={isDesktop ? '54px' : '42px'}
            h={isDesktop ? '54px' : '42px'}
            onClick={() => handleSetHostInfo()}
          />

          {currentUser && isFederationLayout && (
            <Box>
              <Menu
                isOpen={isMyCommunitiesMenuOpen}
                onOpen={() => setIsMyCommunitiesMenuOpen(true)}
                onClose={() => setIsMyCommunitiesMenuOpen(false)}
              >
                <MenuButton
                  as={Button}
                  fontSize="14px"
                  lineHeight={1.2}
                  px="2"
                  rightIcon={<ChevronDownIcon />}
                  textAlign="left"
                  variant="link"
                >
                  {t('profile.myCommunities')}
                </MenuButton>

                <MenuList zIndex="1405">
                  {currentUser?.memberships?.map((m) => (
                    <MenuItem key={m.host} onClick={() => (location.href = `https://${m.host}`)}>
                      {m.hostname}
                    </MenuItem>
                  ))}
                  <Divider colorScheme="gray.700" mt="2" />
                  <MenuItem
                    key="all-communities"
                    onClick={() =>
                      currentHost?.isPortalHost
                        ? navigate('/communities')
                        : (location.href = `https://${platform?.portalHost}/communities`)
                    }
                  >
                    {tc('labels.allCommunities')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </HStack>

        <Modal isOpen={isMyCommunitiesMenuOpen}>
          <ModalOverlay
            onClick={() => {
              setIsMyCommunitiesMenuOpen(false);
            }}
          />
        </Modal>
      </Box>

      <Box pl="2">
        <ConfirmModal
          confirmText={tc('modals.toPortalApp')}
          hideFooter={isPortalHost && isFederationLayout}
          isCentered
          scrollBehavior="inside"
          size="2xl"
          title={publicSettings.name}
          visible={isOpen}
          onConfirm={() => (window.location.href = `https://${platform.portalHost}`)}
          onCancel={() => setIsOpen(false)}
          onOverlayClick={() => setIsOpen(false)}
        >
          {hostInfo && (
            <Box>
              {hostInfo.images && (
                <Center mb="6">
                  <NiceSlider
                    alt={hostInfo.title}
                    height="auto"
                    images={hostInfo.images}
                    isFade={isDesktop}
                  />
                </Center>
              )}

              {hostInfo.longDescription && (
                <Box className="text-content">{parseHtml(hostInfo?.longDescription)}</Box>
              )}
            </Box>
          )}
        </ConfirmModal>
      </Box>
    </Box>
  );
}

export default Header;
