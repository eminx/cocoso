import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Heading,
  Image,
  Link as CLink,
  List,
  ListItem,
  Spinner,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import 'moment/locale/sv';
import 'moment/locale/tr';
import Favicon from 'react-favicon';
import renderHTML from 'react-render-html';

import FeedbackForm from './components/FeedbackForm';
import Header from './components/Header';
import Modal from './components/Modal';
import MenuDrawer from './components/MenuDrawer';
import PortalHostIndicator from './components/PortalHostIndicator';
import { call } from './utils/shared';
import { generateTheme } from './utils/constants/theme';
import { message } from './components/message';
import TopBar from './components/TopBar';

export const StateContext = React.createContext(null);

const publicSettings = Meteor.settings.public;

function LayoutPage({ currentUser, userLoading, hostLoading, children }) {
  const [platform, setPlatform] = useState(null);
  const [currentHost, setCurrentHost] = useState(null);
  const [allHosts, setAllHosts] = useState(null);
  const [platformDrawer, setPlatformDrawer] = useState(false);
  const [hue, setHue] = useState('233');
  const [tc] = useTranslation('common');
  const [isDesktop] = useMediaQuery('(min-width: 960px)');
  const history = useHistory();

  const { pathname } = history.location;

  useEffect(() => {
    getCurrentHost();
    getPlatform();
  }, []);

  useEffect(() => {
    getAllHosts();
  }, [currentHost && currentHost.isPortalHost]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname.split('/')[1]]);

  const getCurrentHost = async () => {
    try {
      const respond = await call('getCurrentHost');
      setCurrentHost(respond);
      setHue(respond?.settings?.hue);
    } catch (error) {
      console.log(error);
    }
  };

  const getPlatform = async () => {
    try {
      const respond = await call('getPlatform');
      setPlatform(respond);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllHosts = async () => {
    try {
      const respond = await call('getAllHosts');
      setAllHosts(respond.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.log(error);
    }
  };

  const setSelectedHue = async () => {
    try {
      await call('setHostHue', hue);
      message.success(tc('message.success.update'));
      await getCurrentHost();
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentHost) {
    return (
      <ChakraProvider>
        <Box w="100%" h="100vh">
          <Center h="100%">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="gray.800"
              size="xl"
            />
          </Center>
        </Box>
      </ChakraProvider>
    );
  }

  const hostWithinUser =
    currentUser &&
    currentUser.memberships &&
    currentUser.memberships.find((membership) => membership.host === location.host);

  const role = hostWithinUser && hostWithinUser.role;
  const canCreateContent = role && ['admin', 'contributor'].includes(role);

  const { menu } = currentHost?.settings;
  const pagesWithHeaderAndFooter = [
    ...menu?.map((item) => '/' + item.name),
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/terms-&-privacy-policy',
    '/communities',
  ];

  const isHeaderAndFooter =
    pagesWithHeaderAndFooter.includes(pathname) || pathname.substring(0, 6) === '/pages';

  const chakraTheme = generateTheme(hue);

  return (
    <>
      <Helmet>
        <title>{currentHost?.settings?.name}</title>
        <link
          rel="android-chrome-192x192"
          sizes="192x192"
          href={`${publicSettings.iconsBaseUrl}/android-chrome-192x192.png`}
        />
        <link
          rel="android-chrome-512x512"
          sizes="512x512"
          href={`${publicSettings.iconsBaseUrl}/android-chrome-512x512.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${publicSettings.iconsBaseUrl}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${publicSettings.iconsBaseUrl}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${publicSettings.iconsBaseUrl}/favicon-16x16.png`}
        />
      </Helmet>
      <Favicon url={`${publicSettings.iconsBaseUrl}/favicon.ico`} />
      <ChakraProvider theme={chakraTheme}>
        <StateContext.Provider
          value={{
            allHosts,
            canCreateContent,
            currentUser,
            currentHost,
            hue,
            isDesktop,
            platform,
            role,
            userLoading,
            getCurrentHost,
            getPlatform,
            setHue,
            setSelectedHue,
          }}
        >
          {platform && platform.isFederationLayout && (
            <TopBar platform={platform} currentUser={currentUser} />
          )}

          <Flex>
            {isDesktop && <MenuDrawer currentHost={currentHost} isDesktop platform={platform} />}

            <Box id="main-viewport" flexGrow="2" bg={`hsl(${hue}deg, 10%, 90%)`}>
              <Box w="100%">
                <Header isSmallerLogo={!isHeaderAndFooter} />

                <Box minHeight="90vh" px={isDesktop ? '2' : '0'}>
                  {children}
                </Box>

                {isHeaderAndFooter && (
                  <Footer currentHost={currentHost} platform={platform} tc={tc} />
                )}

                {isHeaderAndFooter && Boolean(platform?.showFooterInAllCommunities) && (
                  <Box>
                    <Box bg="brand.100" p="4">
                      {!currentHost.isPortalHost && (
                        <a href={`https://${platform?.portalHost}`}>
                          <Center p="2">
                            <Image w="200px" src={platform?.logo} />
                          </Center>
                        </a>
                      )}
                      <Center>
                        <Box textAlign="center">
                          <Text color="brand.800" fontSize="lg" fontWeight="bold">
                            {platform?.name}
                          </Text>
                          <CLink
                            color="brand.500"
                            fontWeight="bold"
                            onClick={() => setPlatformDrawer(true)}
                          >
                            {tc('platform.title')}
                          </CLink>
                        </Box>
                      </Center>
                    </Box>

                    <PlatformDrawer
                      isOpen={platformDrawer}
                      hosts={allHosts}
                      platform={platform}
                      tc={tc}
                      toggleOpen={() => setPlatformDrawer(!platformDrawer)}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Flex>
        </StateContext.Provider>
      </ChakraProvider>
    </>
  );
}

function Footer({ currentHost, tc }) {
  if (!currentHost || !currentHost.settings) {
    return null;
  }

  const activeMenu = currentHost.settings?.menu?.filter((item) => item.isVisible);
  const { settings } = currentHost;

  return (
    <Box w="100%" bg="brand.50" color="brand.900" pt="4">
      <Center p="2">
        <List direction="row" display="flex" flexWrap="wrap" justifyContent="center">
          {activeMenu.map((item) => (
            <ListItem key={item.name} px="2" py="1">
              <Link to={item.name === 'info' ? '/pages/about' : `/${item.name}`}>
                <CLink as="span">{item.label}</CLink>{' '}
              </Link>
            </ListItem>
          ))}
        </List>
      </Center>
      <Box p="2" w="100%">
        <Center w="100%">
          <Flex w="100%" direction="column" justify="center" textAlign="center">
            <Center>
              <Box maxHeight="80px" mt="1" w="220px" ml="2">
                <Image fit="contain" src={currentHost.logo} maxHeight="80px" margin="0 auto" />
              </Box>
            </Center>
            <Heading mb="2" mt="4" size="md">
              {settings.name}
            </Heading>
            <Center>
              {settings.footer ? (
                <Box
                  bg="brand.100"
                  className="text-content"
                  maxWidth="480px"
                  pb="2"
                  p="4"
                  textAlign="center"
                  w="100%"
                >
                  {renderHTML(settings?.footer)}
                </Box>
              ) : (
                <OldFooter host={currentHost.host} settings={settings} />
              )}
            </Center>
            <Box mt="4">
              <Link to="/terms-&-privacy-policy">
                <CLink as="span" fontSize="sm">
                  {tc('terms.title')}{' '}
                </CLink>
              </Link>
            </Box>
          </Flex>
        </Center>
        <Flex align="center" direction="row-reverse" justify="center" mt="2" w="100%">
          <Box size="sm">
            <FeedbackForm />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

function OldFooter({ host, settings }) {
  return (
    <Box border="1px solid #fff" textAlign="center">
      <Text fontSize="sm">
        {settings?.address}
        {', '} {settings?.city}
      </Text>
      <Text fontSize="sm">{settings?.email}</Text>
      <Text fontSize="sm" fontWeight="bold">
        {host}
      </Text>
    </Box>
  );
}

function PlatformDrawer({ isOpen, platform, hosts, tc, toggleOpen }) {
  const thePortalHost = hosts?.find((h) => h.host === platform.portalHost);
  const [t] = useTranslation('hosts');

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom"
      motionPreset="slideInBottom"
      scrollBehavior="inside"
      size="lg"
      title={tc('platform.communitiesIn', { platform: platform?.name })}
      onClose={toggleOpen}
    >
      <List spacing="4">
        <ListItem key={platform.portalHost} borderBottom="1px solid #ddd" pb="4">
          <Text fontSize="sm" mb="2" fontWeight="bold">
            {t('portalHost.indicatorShortText', { platform: platform.name })}:
          </Text>
          <HostItem host={thePortalHost} tc={tc} />
        </ListItem>
        {hosts?.map((host, index) => (
          <ListItem key={host.host}>
            <HostItem host={host} tc={tc} />
          </ListItem>
        ))}
      </List>
    </Modal>
  );
}

function HostItem({ host, tc }) {
  if (!host) {
    return null;
  }
  return (
    <Flex key={host.host}>
      <Flex mr="4" flexShrink="0" bg="gray.100" flexDirection="column" justify="center">
        {host.logo ? (
          <Image fit="contain" w="120px" src={host.logo} />
        ) : (
          <Box bg="pink.100" w="120px" h="100%" />
        )}
      </Flex>
      <Box isTruncated>
        <Text flexShrink="0" fontSize="lg" fontWeight="bold">
          {host.name}
        </Text>
        <Text>
          <Text>{tc('platform.membersCount', { membersCount: host.membersCount })}</Text>
        </Text>
        <Text>{host.city + ', ' + host.country}</Text>
        <Text>
          <CLink href={`https://${host.host}`} title={host.host}>
            {host.host}
          </CLink>
        </Text>
      </Box>
    </Flex>
  );
}

export default withTracker((props) => {
  // const hostSub = Meteor.subscribe('currentHost');
  // const currentHost = Hosts ? Hosts.findOne() : null;
  // const hostLoading = !hostSub.ready();

  const meSub = Meteor.isClient && Meteor.subscribe('me');
  const currentUser = Meteor.isClient && Meteor.user();
  const userLoading = meSub && !meSub.ready();

  return {
    currentUser,
    // currentHost,
    userLoading,
    // hostLoading,
    ...props,
  };
})(LayoutPage);
