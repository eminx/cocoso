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

  const { isHeaderMenu, menu } = currentHost?.settings;
  const pagesWithHeaderAndFooter = [
    ...menu?.map((item) => '/' + item.name),
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/terms-&-privacy-policy',
    '/communities',
  ];

  const chakraTheme = generateTheme(hue);

  const isLargerLogo =
    pagesWithHeaderAndFooter.includes(pathname) || pathname.substring(0, 6) === '/pages';

  const isFederationFooter = platform?.isFederationLayout && platform.footer;

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
          {platform && platform.isFederationLayout && <TopBar />}

          <Flex>
            {isDesktop && !isHeaderMenu && (
              <MenuDrawer currentHost={currentHost} isDesktop platform={platform} />
            )}

            <Box id="main-viewport" flexGrow="2" bg={`hsl(${hue}deg, 10%, 90%)`}>
              <Box w="100%">
                <Header isSmallerLogo={!isLargerLogo} />

                <Box minHeight="90vh" px={isDesktop ? '2' : '0'}>
                  {children}
                </Box>

                <Footer currentHost={currentHost} isFederationFooter={isFederationFooter} tc={tc} />

                {isFederationFooter && <PlatformFooter platform={platform} />}
              </Box>
            </Box>
          </Flex>
        </StateContext.Provider>
      </ChakraProvider>
    </>
  );
}

function Footer({ currentHost, isFederationFooter, tc }) {
  if (!currentHost || !currentHost.settings) {
    return null;
  }

  const activeMenu = currentHost.settings?.menu?.filter((item) => item.isVisible);
  const { settings } = currentHost;

  return (
    <Box bg="brand.50" color="brand.900" w="100%">
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

      {!currentHost.isPortalHost && (
        <Center pt="2">
          <Flex direction="column" justify="center" textAlign="center">
            <Heading size="md">{settings.name}</Heading>
            <Center>
              {settings.footer ? (
                <Box
                  className="text-content"
                  fontSize="85%"
                  maxWidth="480px"
                  mt="4"
                  textAlign="center"
                  w="100%"
                >
                  {renderHTML(settings?.footer)}
                </Box>
              ) : (
                <OldFooter host={currentHost.host} settings={settings} />
              )}
            </Center>
            {!isFederationFooter && (
              <>
                <Box>
                  <Link to="/terms-&-privacy-policy">
                    <CLink as="span" fontSize="xs">
                      {tc('terms.title')}{' '}
                    </CLink>
                  </Link>
                </Box>
                <FeedbackForm />
              </>
            )}
          </Flex>
        </Center>
      )}
    </Box>
  );
}

function PlatformFooter({ platform, children }) {
  const [tc] = useTranslation('common');
  if (!platform) {
    return null;
  }
  return (
    <Center bg="brand.800">
      <Box color="white" fontSize="85%" maxW="480px" py="4" textAlign="center">
        <Box p="4">
          <a href={`https://${platform?.portalHost}`}>
            <Heading color="white" size="md">
              {platform.name}
            </Heading>
          </a>
        </Box>

        <Box p="2" className="text-content">
          {renderHTML(platform.footer)}
        </Box>
        <Box p="2">{children}</Box>

        <Box>
          <Link to="/terms-&-privacy-policy">
            <CLink as="span" color="brand.50" fontSize="xs">
              {tc('terms.title')}{' '}
            </CLink>
          </Link>
        </Box>
        <FeedbackForm isDarkText={false} />
      </Box>
    </Center>
  );
}

function OldFooter({ host, settings }) {
  return (
    <Box textAlign="center" p="4" fontSize="85%">
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

export default withTracker((props) => {
  const meSub = Meteor.isClient && Meteor.subscribe('me');
  const currentUser = Meteor.isClient && Meteor.user();
  const userLoading = meSub && !meSub.ready();

  return {
    currentUser,
    userLoading,
    ...props,
  };
})(LayoutPage);
