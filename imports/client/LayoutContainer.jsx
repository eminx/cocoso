import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Footer,
  Grommet,
  FormField,
  Select,
  TextInput,
  TextArea,
} from 'grommet';

import {
  Box as CBox,
  Button as CButton,
  Center,
  Flex,
  HStack,
  Image,
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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import { ChakraProvider } from '@chakra-ui/react';

export const StateContext = React.createContext(null);

import UserPopup from './UIComponents/UserPopup';
import theme, { chakraTheme } from './constants/theme';

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

pathsWithMenu = menu.map((item) => item.route !== '/page/about' && item.route);

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history]);

  if (currentUser) {
    import 'react-quill/dist/quill.snow.css';
    import './custom-styles/quilleditor-custom.css';
  }

  if (hostLoading || !currentHost) {
    return (
      <CBox width="100%">
        <Center p="1">
          <Text>Loading...</Text>
        </Center>
      </CBox>
    );
  }

  const hsl =
    currentHost.settings &&
    currentHost.settings.mainColor &&
    currentHost.settings.mainColor.hsl;
  let cHue;
  const customTheme = {
    ...theme,
  };
  if (hsl) {
    const themeColor = `hsl(${hsl.h}, ${100 * hsl.s}%, ${100 * hsl.l}%)`;
    customTheme.global.colors.brand = themeColor;
    chakraTheme.colors.brand = themeColor;
    customTheme.global.colors['brand-light'] = `hsl(${hsl.h}, ${
      100 * hsl.s
    }%, 95%)`;
    customTheme.global.colors.focus = `hsl(${hsl.h}, 80%, 60%)`;

    // complementary color is calculated:
    cHue = hsl.h > 180 ? hsl.h - 180 : 180 - hsl.h;
  }

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
    <Grommet theme={customTheme}>
      {publicSettings.faviconUrl && (
        <Helmet>
          <link rel="icon" href={publicSettings.faviconUrl} />
        </Helmet>
      )}
      <ChakraProvider theme={chakraTheme}>
        <StateContext.Provider
          value={{
            currentUser,
            userLoading,
            currentHost,
            role,
            canCreateContent,
          }}
        >
          <Center className="main-viewport" style={getBackgroundStyle(cHue)}>
            <CBox width="1280px">
              <Header {...headerProps} />
              <CBox style={{ minHeight: '100vh' }}>{children}</CBox>

              <Footer background="light-3" justify="center" pad="medium">
                <CButton
                  variant="ghost"
                  onClick={() => setShowFeedbackModal(true)}
                >
                  Give Feedback
                </CButton>

                <Modal
                  isOpen={showFeedbackModal}
                  onClose={() => setShowFeedbackModal(false)}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Give Feedback</ModalHeader>
                    <ModalCloseButton />
                    <form
                      action="https://formspree.io/f/xdopweon"
                      method="POST"
                    >
                      <ModalBody>
                        <FormField label="Your email address">
                          <TextInput type="email" name="_replyto" />
                        </FormField>

                        <FormField label="Subject">
                          <Select
                            type="text"
                            name="subject"
                            options={['Bug', 'Suggestion', 'Compliment']}
                          />
                        </FormField>

                        <FormField label="Details">
                          <TextArea name="text" name="message" />
                        </FormField>
                      </ModalBody>
                      <ModalFooter>
                        <CButton mr={3} onClick={onClose}>
                          Close
                        </CButton>
                        <CButton colorScheme="blue" type="submit">
                          Send
                        </CButton>
                      </ModalFooter>
                    </form>
                  </ModalContent>
                </Modal>
              </Footer>
            </CBox>
          </Center>
        </StateContext.Provider>
      </ChakraProvider>
    </Grommet>
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
    <ScreenClassRender
      render={(screenClass) => {
        const large = ['lg', 'xl', 'xxl'].includes(screenClass);

        return (
          <Container fluid style={{ width: '100%', padding: 0, zIndex: 9 }}>
            <Row
              style={{ marginLeft: 0, marginRight: 0, marginBottom: 12 }}
              align="center"
            >
              <Col xs={3} style={{ paddingLeft: 0 }}>
                <Link to="/">
                  <CBox w="120px" h="60px" mt="1" ml="1">
                    <Image
                      fit="contain"
                      src={currentHost && currentHost.logo}
                      className="header-logo"
                    />
                  </CBox>
                </Link>
              </Col>
              <Col xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <Menu
                  currentHost={currentHost}
                  large={large}
                  history={history}
                />
              </Col>
              <Col xs={3} style={{ paddingRight: 0 }}>
                <Flex justify="flex-end">
                  <UserPopup currentUser={currentUser} />
                </Flex>
              </Col>
            </Row>
          </Container>
        );
      }}
    />
  );
};

const Menu = ({ currentHost, large, history }) => {
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

  const isCurrentPage = (label) => {
    if (label === 'info') {
      return pathname.substring(0, 5) === '/page';
    }
    return label === pathname.substring(1, pathname.length);
  };

  if (large) {
    return (
      <HStack>
        {menuItems.map((item) => (
          <CBox as="button" key={item.label} onClick={() => handleClick(item)}>
            <Text
              m="1"
              fontWeight={isCurrentPage(item.label) ? 'bold' : 'normal'}
              textTransform="capitalize"
            >
              {item.label}
            </Text>
          </CBox>
        ))}
      </HStack>
    );
  }

  return (
    <CMenu placement="bottom" closeOnSelect>
      <MenuButton>
        <HStack>
          <Text>Menu</Text>
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
  );
};

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
