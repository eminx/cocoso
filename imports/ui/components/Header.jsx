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
    <Box px="2" w="100%" mb="4" data-oid="1tnu04m">
      <Flex w="100%" align="flex-start" justify="space-between" data-oid="14m_r5m">
        <Box w="120px" data-oid="4y9ui:1">
          {isFederationLayout && (
            <TopLeftFederatinLogoMenu currentHost={currentHost} data-oid="dnz4df3" />
          )}
        </Box>

        <Box p="2" mt={isDesktop ? '0' : isFederationLayout ? '42px' : '0'} data-oid="jvpi6xc">
          <Box data-oid="ugh7w43">
            {currentHost.logo ? (
              <Link to="/" data-oid="h_dq37i">
                <Image
                  className={logoClass}
                  fit="contain"
                  src={currentHost.logo}
                  data-oid="w4:g3f7"
                />
              </Link>
            ) : (
              <Box data-oid="_e4vo5t">
                <Link to="/" data-oid="pd4h5h4">
                  <CHeading
                    color="brand.800"
                    fontWeight="400"
                    fontFamily="Raleway, Sarabun, sans-serif"
                    data-oid="hsf1hfc"
                  >
                    {currentHost.settings?.name}
                  </CHeading>
                </Link>
                {isAdmin && (
                  <Center data-oid="ue5b5me">
                    <Link to="/admin/settings/organization" data-oid="cjwb_5c">
                      <Button
                        as="span"
                        colorScheme="orange"
                        fontWeight="light"
                        variant="link"
                        data-oid="dhzf0.o"
                      >
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
          data-oid="ip-d.u2"
        >
          {(!isDesktop || !isHeaderMenu) && (
            <MenuDrawer
              currentHost={currentHost}
              isDesktop={isDesktop}
              platform={platform}
              data-oid="qppl:g9"
            />
          )}
          {currentUser && <UserPopup data-oid=".kdhkhk" />}
          {!currentUser && <LoginSignupLinks data-oid="n4awnj2" />}
        </HStack>
      </Flex>

      {isDesktop && isHeaderMenu && <WrappedMenu menuItems={menuItems} data-oid="y_y2c1u" />}
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
      data-oid="ddh1f6c"
    >
      <Link to="/login" style={{ marginRight: '12px' }} data-oid="ri7y-8h">
        <Button {...linkButtonProps} size={isDesktop ? 'sm' : 'xs'} data-oid="n.ab8gg">
          {tc('menu.guest.login')}
        </Button>
      </Link>

      <Link to="/register" data-oid="d7p0p0e">
        <Button {...linkButtonProps} size={isDesktop ? 'sm' : 'xs'} data-oid="z:r.web">
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
    <Center p="4" data-oid="jtme605">
      <HStack alignItems="flex-start" mb="2" wrap="wrap" data-oid="90okif_">
        {menuItems.map((item) => {
          const isCurrentPageLabel = isCurrentPage(item);
          return (
            <Link key={item.name} to={item.route} data-oid="l4u8tin">
              <Box px="2" data-oid="l5.yt6i">
                <Text
                  as="span"
                  _hover={!isCurrentPageLabel && { borderBottom: '2px dashed' }}
                  borderBottom={isCurrentPageLabel ? '2px solid' : '2px transparent'}
                  color={isCurrentPageLabel ? 'gray.800' : 'brand.500'}
                  fontFamily="Raleway, Sarabun, sans"
                  fontWeight="bold"
                  data-oid="f.pwr:k"
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
    <Box position="relative" data-oid="7gfc-01">
      <Box ml="2" className="federation-logo" position="absolute" data-oid="5ccbih7">
        <HStack data-oid="co1z16a">
          <Image
            fit="contain"
            src="https://samarbetet.s3.eu-central-1.amazonaws.com/emin/adaptive-icon.png"
            w={isDesktop ? '54px' : '42px'}
            h={isDesktop ? '54px' : '42px'}
            onClick={() => handleSetHostInfo()}
            data-oid="x.cq6gi"
          />

          {currentUser && isFederationLayout && (
            <Box data-oid="0qe:eqq">
              <Menu
                isOpen={isMyCommunitiesMenuOpen}
                onOpen={() => setIsMyCommunitiesMenuOpen(true)}
                onClose={() => setIsMyCommunitiesMenuOpen(false)}
                data-oid="d5ja:a8"
              >
                <MenuButton
                  as={Button}
                  fontSize="14px"
                  lineHeight={1.2}
                  px="2"
                  rightIcon={<ChevronDownIcon data-oid="5wbeyw3" />}
                  textAlign="left"
                  variant="link"
                  data-oid=":e_lctx"
                >
                  {t('profile.myCommunities')}
                </MenuButton>

                <MenuList zIndex="1405" data-oid="y.q_nkk">
                  {currentUser?.memberships?.map((m) => (
                    <MenuItem
                      key={m.host}
                      onClick={() => (location.href = `https://${m.host}`)}
                      data-oid="szpflus"
                    >
                      {m.hostname}
                    </MenuItem>
                  ))}
                  <Divider colorScheme="gray.700" mt="2" data-oid="_e.fy.." />
                  <MenuItem
                    key="all-communities"
                    onClick={() =>
                      currentHost?.isPortalHost
                        ? navigate('/communities')
                        : (location.href = `https://${platform?.portalHost}/communities`)
                    }
                    data-oid="yv4bfar"
                  >
                    {tc('labels.allCommunities')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </HStack>

        <Modal isOpen={isMyCommunitiesMenuOpen} data-oid="b6a2xyu">
          <ModalOverlay
            onClick={() => {
              setIsMyCommunitiesMenuOpen(false);
            }}
            data-oid="5mox5e5"
          />
        </Modal>
      </Box>

      <Box pl="2" data-oid="qgws1-h">
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
          data-oid="cd01hd5"
        >
          {hostInfo && (
            <Box data-oid="bms.9xl">
              {hostInfo.images && (
                <Center mb="6" data-oid="sz0.jrb">
                  <NiceSlider
                    alt={hostInfo.title}
                    height="auto"
                    images={hostInfo.images}
                    isFade={isDesktop}
                    data-oid="dnb7yit"
                  />
                </Center>
              )}

              {hostInfo.longDescription && (
                <Box className="text-content" data-oid="8:hzv0h">
                  {parseHtml(hostInfo?.longDescription)}
                </Box>
              )}
            </Box>
          )}
        </ConfirmModal>
      </Box>
    </Box>
  );
}

export default Header;
