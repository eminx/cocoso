import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Heading,
  HStack,
  Image,
  Link as CLink,
  List,
  ListItem,
  Menu as CMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import { useTranslation } from 'react-i18next';

import Hosts from '../api/hosts/host';
import UserPopup from './components/UserPopup';
import ChangeLanguage from './components/ChangeLanguageMenu';
import FeedbackForm from './components/FeedbackForm';
import { chakraTheme } from './utils/constants/theme';

export const StateContext = React.createContext(null);

const publicSettings = Meteor.settings.public;

const getRoute = (item, index) => {
  if (index === 0) {
    return '/';
  }
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

const getBackgroundStyle = (cHue) => {
  return {
    backgroundColor: 'rgb(245, 245, 245)',
  };

  if (!cHue) {
    return {
      backgroundColor: '#fff',
    };
  }
  return {
    backgroundImage: `-moz-linear-gradient(
    0deg,
    hsl(${cHue}, 80%, 80%),
    hsl(${cHue}, 80%, 95%)
  )`,
    backgroundImage: `-webkit-linear-gradient(
    0deg,
    hsl(${cHue}, 80%, 80%),
    hsl(${cHue}, 80%, 95%)
  )`,
    backgroundImage: `linear-gradient(
    0deg,
    hsl(${cHue}, 80%, 99%),
    hsl(${cHue}, 80%, 90%)
  )`,
  };
};

function LayoutPage({ currentUser, currentHost, userLoading, hostLoading, history, children }) {
  const [tc] = useTranslation('common');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history.location.pathname]);

  if (currentUser) {
    import 'react-quill/dist/quill.snow.css';
    import './utils/styles/quilleditor-custom.css';
  }

  if (hostLoading || !currentHost) {
    return (
      <ChakraProvider>
        <Box w="100%" h="100vh">
          <Center h="100%">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        </Box>
      </ChakraProvider>
    );
  }

  // const hsl =
  //   currentHost.settings &&
  //   currentHost.settings.mainColor &&
  //   currentHost.settings.mainColor.hsl;
  // let cHue;
  // const customTheme = {
  //   ...theme,
  // };
  // if (hsl) {
  //   const themeColor = `hsl(${hsl.h}, ${100 * hsl.s}%, ${100 * hsl.l}%)`;
  //   customTheme.global.colors.brand = themeColor;
  //   chakraTheme.colors.brand = themeColor;
  //   customTheme.global.colors['brand-light'] = `hsl(${hsl.h}, ${
  //     100 * hsl.s
  //   }%, 95%)`;
  //   customTheme.global.colors.focus = `hsl(${hsl.h}, 80%, 60%)`;

  //   // complementary color is calculated:
  //   cHue = hsl.h > 180 ? hsl.h - 180 : 180 - hsl.h;
  // }

  const headerProps = {
    currentUser,
    currentHost,
    history,
    title: 'Fanus',
  };

  const hostWithinUser =
    currentUser &&
    currentUser.memberships &&
    currentUser.memberships.find((membership) => membership.host === location.host);

  const role = hostWithinUser && hostWithinUser.role;
  const canCreateContent = role && ['admin', 'contributor'].includes(role);

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
        }}
      >
        <Center className="main-viewport" style={getBackgroundStyle()}>
          <Box maxWidth="1400px" w="100%">
            <Header {...headerProps} />

            <Box style={{ minHeight: '100vh' }}>{children}</Box>

            <Footer currentHost={currentHost} tc={tc} />
          </Box>
        </Center>
      </StateContext.Provider>
    </ChakraProvider>
  );
}

function Header({ currentUser, currentHost, title, history }) {
  return (
    <Box mb="4">
      <ScreenClassRender
        render={(screenClass) => {
          const isMobile = ['xs'].includes(screenClass);

          return (
            <Container fluid style={{ width: '100%', padding: 0, zIndex: 9 }}>
              <Row
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 12,
                  marginTop: 12,
                  alignItems: 'flex-start',
                }}
              >
                <Col xs={3} style={{ paddingLeft: 0 }}>
                  <Link to="/">
                    <Box w="120px" h="60px" ml="3">
                      <Image
                        fit="contain"
                        src={currentHost && currentHost.logo}
                        className="header-logo"
                      />
                    </Box>
                  </Link>
                </Col>
                <Col xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                  {!isMobile && (
                    <Menu
                      currentHost={currentHost}
                      isMobile={false}
                      screenClass={screenClass}
                      history={history}
                    />
                  )}
                </Col>
                <Col xs={3} style={{ paddingRight: 0 }}>
                  <Flex justify="flex-end">
                    <UserPopup currentUser={currentUser} />
                  </Flex>
                </Col>
              </Row>
              {isMobile && <Menu currentHost={currentHost} isMobile history={history} />}
            </Container>
          );
        }}
      />
    </Box>
  );
}

function Menu({ currentHost, isMobile, screenClass, history }) {
  const ref = useRef();
  if (!currentHost || !currentHost.settings || !currentHost.settings.menu) {
    return null;
  }

  const menu = currentHost.settings.menu;

  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  const pathname = history.location.pathname;

  const handleClick = (item) => {
    history.push(item.route);
  };

  const isCurrentPage = (name) => {
    if (name === 'info') {
      return pathname.substring(0, 6) === '/pages';
    }
    return name === pathname.substring(1, pathname.length);
  };

  const activeMenuItem = menuItems.find((item) => isCurrentPage(item.name));

  if (['lg', 'xl', 'xxl'].includes(screenClass)) {
    return (
      <Wrap align="center" pt="lg" spacing="4">
        {menuItems.map((item) => (
          <Box as="button" key={item.name} onClick={() => handleClick(item)}>
            <Text
              borderBottom={
                activeMenuItem && activeMenuItem.label === item.label ? '1px solid #010101' : 'none'
              }
              mx="1"
              textTransform="capitalize"
            >
              {item.label}
            </Text>
          </Box>
        ))}
      </Wrap>
    );
  }

  return (
    <Box align="center">
      <CMenu placement="bottom" closeOnSelect>
        <MenuButton>
          <HStack>
            <Text textTransform="capitalize">{activeMenuItem ? activeMenuItem.label : 'Menu'}</Text>
            <ChevronDownIcon />
          </HStack>
        </MenuButton>
        <MenuList>
          {menuItems.map((item) => (
            <MenuItem key={item.label} onClick={() => handleClick(item)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </CMenu>
    </Box>
  );
}

function Footer({ currentHost, tc }) {
  if (!currentHost) {
    return null;
  }

  const activeMenu = currentHost.settings?.menu?.filter((item) => item.isVisible);

  return (
    <Box w="100%" bg="#363636" color="gray.200" pt="4">
      <Center p="2">
        <List direction="row" display="flex" flexWrap="wrap" justifyContent="center">
          {activeMenu.map((item) => (
            <ListItem key={item.name} px="2" py="1">
              <Link to={`/${item.name}`}>
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
              <Box w="120px" h="60px" ml="3">
                <Image fit="contain" src={currentHost.logo} className="header-logo" />
              </Box>
            </Center>
            <Heading my="2" size="md">
              {currentHost.settings?.name}
            </Heading>
            <Text fontSize="sm">
              {currentHost.settings?.address} {', '} {currentHost.settings?.city}
            </Text>
            <Text fontSize="sm">{currentHost.settings?.email}</Text>
            <Text fontSize="sm" fontWeight="bold">
              {currentHost.host}
            </Text>
            <Box mt="4">
              <Link to="/pages/terms">
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
