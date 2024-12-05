import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Center,
  ChakraProvider,
  ColorModeProvider,
  Flex,
  Heading,
  Link as CLink,
  List,
  ListItem,
  Progress,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import renderHTML from 'react-render-html';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/sv';
import 'moment/locale/tr';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

import FeedbackForm from './components/FeedbackForm';
import Header from './components/Header';
import { call } from './utils/shared';
import { generateTheme } from './utils/constants/theme';
import { message } from './components/message';
import TopBar from './components/TopBar';
import ChangeLanguageMenu from './components/ChangeLanguageMenu';

export const StateContext = React.createContext(null);
const publicSettings = Meteor.settings.public;

dayjs.extend(updateLocale);

function LayoutPage({ currentUser, userLoading, children }) {
  const [platform, setPlatform] = useState(null);
  const [currentHost, setCurrentHost] = useState(null);
  const [allHosts, setAllHosts] = useState(null);
  const [hue, setHue] = useState('233');
  const [tc, i18n] = useTranslation();
  const [isDesktop] = useMediaQuery('(min-width: 960px)');
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    moment.locale(i18n?.language || 'en-gb', {
      week: {
        dow: 1,
      },
    });
    dayjs.updateLocale('en', {
      weekStart: 1,
    });
  }, [i18n?.language]);

  useEffect(() => {
    getCurrentHost();
    getPlatform();
    getAllHosts();
  }, []);

  const pathnameSplitted = pathname.split('/');

  useEffect(() => {
    if (pathnameSplitted[1][0] === '@' && !pathnameSplitted[3]) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathnameSplitted[2]]);

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

  const chakraTheme = generateTheme(hue);

  const hostWithinUser =
    currentUser &&
    currentUser.memberships &&
    currentUser.memberships.find((membership) => membership.host === window.location.host);

  const role = hostWithinUser && hostWithinUser.role;
  const canCreateContent = role && ['admin', 'contributor'].includes(role);

  const menu = currentHost?.settings?.menu;
  const pagesWithHeaderAndFooter = menu && [
    ...menu?.map((item) => '/' + item?.name),
    '/forgot-password',
    '/reset-password',
    '/terms-&-privacy-policy',
    '/communities',
  ];

  const isLargerLogo =
    pagesWithHeaderAndFooter?.includes(pathname) || pathname.substring(0, 6) === '/pages';

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

      <ChakraProvider theme={chakraTheme}>
        <ColorModeProvider>
          {!currentHost && <Progress size="xs" colorScheme="brand.500" isIndeterminate />}
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
            {/* {platform && platform.isFederationLayout && <TopBar />} */}

            <Flex>
              <Box id="main-viewport" flexGrow="2">
                <Box w="100%">
                  <Header isSmallerLogo={!isLargerLogo} />

                  <Box mb="12" minHeight="90vh" px={isDesktop ? '2' : '0'}>
                    {children}
                  </Box>

                  <Footer
                    currentHost={currentHost}
                    isFederationFooter={isFederationFooter}
                    tc={tc}
                  />

                  {isFederationFooter && <PlatformFooter platform={platform} />}
                </Box>
              </Box>
            </Flex>
          </StateContext.Provider>
        </ColorModeProvider>
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
      <Center p="4">
        <List direction="row" display="flex" flexWrap="wrap" justifyContent="center">
          {activeMenu.map((item) => (
            <ListItem key={item.name} px="4" py="2">
              <Link to={item.name === 'info' ? '/pages/about' : `/${item.name}`}>
                <CLink as="span" color="brand.500" fontWeight="bold">
                  {item.label}
                </CLink>{' '}
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
      <Center p="4">
        <ChangeLanguageMenu isCentered />
      </Center>
    </Box>
  );
}

function PlatformFooter({ platform, children }) {
  const [tc] = useTranslation('common');
  if (!platform) {
    return null;
  }
  return (
    <Center bg="black" className="platform-footer">
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
