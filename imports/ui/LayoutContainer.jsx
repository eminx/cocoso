import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import {
  Box,
  Center,
  ChakraProvider,
  Code,
  Flex,
  Heading,
  Image,
  Link as CLink,
  List,
  ListItem,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import Hosts from '../api/hosts/host';
import ChangeLanguage from './components/ChangeLanguageMenu';
import FeedbackForm from './components/FeedbackForm';
import { chakraTheme } from './utils/constants/theme';
import Header from './components/Header';
import Drawer from './components/Drawer';
import { call } from './utils/shared';

export const StateContext = React.createContext(null);

const publicSettings = Meteor.settings.public;

function LayoutPage({ currentUser, currentHost, userLoading, hostLoading, history, children }) {
  const [platform, setPlatform] = useState(null);
  const [tc] = useTranslation('common');
  const [isDesktop] = useMediaQuery('(min-width: 960px)');
  const { pathname, search } = history.location;

  useEffect(() => {
    Meteor.call('getPlatform', (error, respond) => {
      setPlatform(respond);
    });

    const params = parse(search);
    if (params && params.noScrollTop) {
      return;
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  if (hostLoading || !currentHost) {
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
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/terms-&-privacy-policy',
  ];

  const isHeaderAndFooter =
    pagesWithHeaderAndFooter.includes(pathname) || pathname.substring(0, 6) === '/pages';

  return (
    <ChakraProvider theme={chakraTheme}>
      {publicSettings.faviconUrl && (
        <Helmet>
          <link rel="icon" href={publicSettings.faviconUrl} />
        </Helmet>
      )}
      <StateContext.Provider
        value={{
          currentUser,
          userLoading,
          currentHost,
          role,
          canCreateContent,
          isDesktop,
        }}
      >
        <Center className="main-viewport">
          <Box maxWidth="1400px" w="100%">
            {isHeaderAndFooter && <Header />}

            <Box style={{ minHeight: '90vh' }}>{children}</Box>

            {isHeaderAndFooter && <Footer currentHost={currentHost} platform={platform} tc={tc} />}
          </Box>
        </Center>
      </StateContext.Provider>
    </ChakraProvider>
  );
}

function Footer({ currentHost, platform, tc }) {
  const [platformDrawer, setPlatformDrawer] = useState(false);
  const [hosts, setHosts] = useState([]);

  useEffect(() => {
    getAllHosts();
  }, []);

  const getAllHosts = async () => {
    try {
      const allHosts = await call('getAllHosts');
      setHosts(allHosts);
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentHost) {
    return null;
  }

  const activeMenu = currentHost.settings?.menu?.filter((item) => item.isVisible);

  return (
    <Box w="100%" bg="gray.200" color="gray.800" pt="4">
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
              <Box maxHeight="80px" mt="1" w="220px">
                <Image fit="contain" src={currentHost.logo} maxHeight="80px" margin="0 auto" />
              </Box>
            </Center>
            <Heading my="2" size="md">
              {currentHost.settings?.name}
            </Heading>
            <Text fontSize="sm">
              {currentHost.settings?.address}
              {', '} {currentHost.settings?.city}
            </Text>
            <Text fontSize="sm">{currentHost.settings?.email}</Text>
            <Text fontSize="sm" fontWeight="bold">
              {currentHost.host}
            </Text>
            <Box mt="4">
              <Link to="/terms-&-privacy-policy">
                <CLink as="span" fontSize="sm">
                  {tc('terms.title')}{' '}
                </CLink>
              </Link>
            </Box>
          </Flex>
        </Center>
        <Flex align="flex-start" direction="row-reverse" justify="space-between" mt="2" w="100%">
          <Box size="sm">
            <ChangeLanguage />
          </Box>
          <Box size="sm">
            <FeedbackForm />
          </Box>
        </Flex>
      </Box>

      <Center p="8" bg="gray.900">
        <Box textAlign="center" color="gray.100">
          <Text>{platform?.name}</Text>
          <CLink onClick={() => setPlatformDrawer(true)}>See communities</CLink>
        </Box>
      </Center>

      {hosts && (
        <Drawer
          isOpen={platformDrawer}
          placement="bottom"
          size="lg"
          title={platform?.name}
          zIndex="999 "
          onClose={() => setPlatformDrawer(false)}
        >
          <Box>
            <Table variant="simple">
              <Tbody>
                {hosts?.map((host, index) => (
                  <Tr key={host.host}>
                    <Td>
                      <Image src={host.logo} h="50px" />
                    </Td>
                    <Td>
                      <Text fontSize="lg" fontWeight="bold" mb="1">
                        {host.name}
                      </Text>
                      <Text mb="0.5">
                        <Code>
                          <CLink href={`https://${host.host}`} isExternal title={host.host}>
                            {host.host}
                            <ExternalLinkIcon mx="2px" mb="3px" />
                          </CLink>
                        </Code>
                      </Text>
                      <Text mb="0.5">
                        <Text as="samp">{host.membersCount}</Text> members
                      </Text>
                      <Text>{host.city + ', ' + host.country}</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}

export default withTracker((props) => {
  const hostSub = Meteor.subscribe('currentHost');
  const currentHost = Hosts ? Hosts.findOne() : null;
  const hostLoading = !hostSub.ready();

  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const userLoading = !meSub.ready();

  return {
    currentUser,
    currentHost,
    userLoading,
    hostLoading,
  };
})(LayoutPage);
