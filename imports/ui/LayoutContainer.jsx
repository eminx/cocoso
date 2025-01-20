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
import parseHtml from 'html-react-parser';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/sv';
import 'moment/locale/tr';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

import FeedbackForm from './components/FeedbackForm';
import { call } from './utils/shared';
import { generateTheme } from './utils/constants/theme';
import ChangeLanguageMenu from './components/ChangeLanguageMenu';
import Header from './layout/Header';
import HelmetHybrid from './layout/HelmetHybrid';

export const StateContext = React.createContext(null);
const publicSettings = Meteor.settings.public;

dayjs.extend(updateLocale);

function LayoutPage({ currentUser, userLoading, children }) {
  const initialCurrentHost = window?.__PRELOADED_STATE__?.Host || null;
  const [platform, setPlatform] = useState(null);
  const [currentHost, setCurrentHost] = useState(initialCurrentHost);
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
      <HelmetHybrid Host={currentHost} />
      <ChakraProvider theme={chakraTheme}>
        <ColorModeProvider>
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
            <Box bg="gray.100" minH="1800px">
              <Header Host={currentHost} />
              {children}
            </Box>

            {/* <Footer
                     currentHost={currentHost}
                     isFederationFooter={isFederationFooter}
                     tc={tc}
                   /> */}

            {/* {isFederationFooter && <PlatformFooter platform={platform} />} */}
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
                  {parseHtml(settings?.footer)}
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
          {parseHtml(platform.footer)}
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
