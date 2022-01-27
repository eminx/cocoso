import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  HStack,
  Image,
  Input,
  Menu as CMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  Textarea,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import { useTranslation } from 'react-i18next';

export const StateContext = React.createContext(null);

import UserPopup from './components/UserPopup';
import FormField from './components/FormField';
import Hosts from '../api/@hosts/host';
import { chakraTheme } from './@/constants/theme';

const publicSettings = Meteor.settings.public;

const menu = [
  {
    label: 'Activities',
    route: '/',
  },
  {
    label: 'Processes',
    route: '/processes',
  },
  {
    label: 'Calendar',
    route: '/calendar',
  },
  {
    label: 'Works',
    route: '/works',
  },
  {
    label: 'Info',
    route: `/page/about`,
  },
];

const getRoute = (item, index) => {
  if (index === 0) {
    return '/';
  }
  if (item.name === 'info') {
    return '/page/about';
  }
  return `/${item.name}`;
};

const getGotoPath = (pathname) => {
  const shortPath = pathname.substring(0, 3);
  if (shortPath === '/pr') {
    return '/processes';
  } else if (pathname.includes('/work/')) {
    return '/works';
  } else {
    return '/';
  }
};

const getBackgroundStyle = (cHue) => {
  return {
    backgroundColor: 'rgba(0, 0, 0, .08)',
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

function LayoutPage({
  currentUser,
  currentHost,
  userLoading,
  hostLoading,
  history,
  children,
}) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [ t ] = useTranslation('common');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history]);

  if (currentUser) {
    import 'react-quill/dist/quill.snow.css';
    import './@/styles/quilleditor-custom.css';
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
    currentUser.memberships.find(
      (membership) => membership.host === location.host
    );

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

            <Flex bg="gray.100" justify="center" p="6">
              <Center>
                <Button
                  variant="ghost"
                  onClick={() => setShowFeedbackModal(true)}
                >
                  {t('feedback.label')}
                </Button>
              </Center>

              <Modal
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{t('feedback.label')}</ModalHeader>
                  <ModalCloseButton />
                  <form action="https://formspree.io/f/xdopweon" method="POST">
                    <ModalBody>
                      <VStack spacing="6">
                        <FormField label={t('feedback.form.email.label')}>
                          <Input type="email" name="_replyto" />
                        </FormField>

                        <FormField label={t('feedback.form.subject.label')}>
                          <Select name="subject">
                            {[t('feedback.form.subject.select.suggest'), t('feedback.form.subject.select.bug'), t('feedback.form.subject.select.compliment')].map(
                              (option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              )
                            )}
                          </Select>
                        </FormField>

                        <FormField label={t('feedback.form.details.label')}>
                          <Textarea name="text" name="message" />
                        </FormField>
                      </VStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        mr={3}
                        onClick={() => setShowFeedbackModal(false)}
                      >
                        {t('actions.close')}
                      </Button>
                      <Button colorScheme="blue" type="submit">
                        {t('actions.send')}
                      </Button>
                    </ModalFooter>
                  </form>
                </ModalContent>
              </Modal>
            </Flex>
          </Box>
        </Center>
      </StateContext.Provider>
    </ChakraProvider>
  );
}

const Header = ({ currentUser, currentHost, title, history }) => {
  const UserStuff = () => (
    <NotificationsPopup notifications={currentUser.notifications} />
  );

  const pathname = location.pathname;
  const gotoPath = getGotoPath(pathname);

  const isPage = pathname.substring(0, 5) === '/page';

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
                <Col
                  xs={6}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
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
              {isMobile && (
                <Menu currentHost={currentHost} isMobile history={history} />
              )}
            </Container>
          );
        }}
      />
    </Box>
  );
};

const Menu = ({ currentHost, isMobile, screenClass, history }) => {
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
      return pathname.substring(0, 5) === '/page';
    }
    return name === pathname.substring(1, pathname.length);
  };

  const activeMenuItem = menuItems.find((item) => {
    return isCurrentPage(item.name);
  });

  console.log(screenClass);

  if (['lg', 'xl', 'xxl'].includes(screenClass)) {
    return (
      <Wrap align="center" pt="lg" spacing="4">
        {menuItems.map((item) => (
          <Box as="button" key={item.name} onClick={() => handleClick(item)}>
            <Text
              borderBottom={
                activeMenuItem && activeMenuItem.label === item.label
                  ? '1px solid #010101'
                  : 'none'
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
            <Text textTransform="capitalize">
              {activeMenuItem ? activeMenuItem.label : 'Menu'}
            </Text>
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
};

const MobileMenu = ({}) => {};

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
