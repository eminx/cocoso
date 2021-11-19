import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  DropButton,
  Footer,
  Grommet,
  Heading,
  FormField,
  Image,
  Layer,
  Paragraph,
  Select,
  TextInput,
  TextArea,
} from 'grommet';

import {
  Box as CBox,
  HStack,
  Menu as CMenu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  extendTheme,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { Close } from 'grommet-icons/icons/Close';

import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import { ChakraProvider } from '@chakra-ui/react';

export const StateContext = React.createContext(null);

import UserPopup from './UIComponents/UserPopup';
import theme from './constants/theme';

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

const chakraTheme = extendTheme({
  fonts: {
    heading: 'Sarabun, sans-serif',
    body: 'Sarabun, sans-serif',
  },
});

function LayoutPage({
  currentUser,
  currentHost,
  userLoading,
  hostLoading,
  history,
  children,
}) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history]);

  if (currentUser) {
    import 'react-quill/dist/quill.snow.css';
    import './custom-styles/quilleditor-custom.css';
  }

  if (hostLoading || !currentHost) {
    return (
      <Box width="100%">
        <Box pad="medium" alignSelf="center">
          <Text>Loading...</Text>
        </Box>
      </Box>
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
    customTheme.global.colors.brand = `hsl(${hsl.h}, ${100 * hsl.s}%, ${
      100 * hsl.l
    }%)`;
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
          <Box
            className="main-viewport"
            justify="center"
            style={getBackgroundStyle(cHue)}
            fill
          >
            <Box width={{ max: '1280px' }} alignSelf="center" fill>
              <Header {...headerProps} />
              <Box>{children}</Box>
              {/* <FooterInfo settings={settings} /> */}

              <Footer justify="center">
                <Box pad="large">
                  <Anchor onClick={() => setShowFeedbackModal(true)}>
                    Give Feedback
                  </Anchor>
                </Box>

                {showFeedbackModal && (
                  <Layer
                    position="bottom"
                    full="vertical"
                    modal
                    onClickOutside={() => setShowFeedbackModal(false)}
                    onEsc={() => setShowFeedbackModal(false)}
                    animation="fadeIn"
                  >
                    <Box pad="medium" width="large">
                      <Box direction="row" justify="between">
                        <Heading level={2} margin="none">
                          Give Feedback
                        </Heading>
                        <Button
                          icon={<Close />}
                          onClick={() => setShowFeedbackModal(false)}
                        />
                      </Box>
                      <form
                        action="https://formspree.io/f/xdopweon"
                        method="POST"
                      >
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

                        <Box
                          direction="row"
                          justify="end"
                          pad={{ top: 'large' }}
                        >
                          <Button type="submit" label="Send" />
                        </Box>
                      </form>
                    </Box>
                  </Layer>
                )}
              </Footer>
            </Box>
          </Box>
        </StateContext.Provider>
      </ChakraProvider>
    </Grommet>
  );
}

const boldBabe = {
  textTransform: 'uppercase',
  fontWeight: 700,
};

const Header = ({ currentUser, currentHost, title, history }) => {
  const UserStuff = () => (
    <Box justify="end" direction="row" alignContent="center">
      {/* {currentUser && (
        <NotificationsPopup notifications={currentUser.notifications} />
      )} */}
      <UserPopup currentUser={currentUser} />
    </Box>
  );

  const pathname = location.pathname;
  const gotoPath = getGotoPath(pathname);

  const isPage = pathname.substring(0, 5) === '/page';
  const isMenuPage = isPage || pathsWithMenu.includes(pathname);

  return (
    <ScreenClassRender
      render={(screenClass) => {
        const large = ['lg', 'xl', 'xxl'].includes(screenClass);

        return (
          <Container fluid style={{ width: '100%', padding: 0 }}>
            <Row
              style={{ marginLeft: 0, marginRight: 0, marginBottom: 12 }}
              align="center"
            >
              <Col xs={3} style={{ paddingLeft: 0 }}>
                <Box>
                  <Link to="/">
                    <Box
                      width="120px"
                      height="60px"
                      margin={{ top: 'small', left: 'small' }}
                    >
                      <Image
                        fit="contain"
                        src={currentHost && currentHost.logo}
                        className="header-logo"
                      />
                    </Box>
                  </Link>
                </Box>
              </Col>
              <Col xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <Menu
                  currentHost={currentHost}
                  large={large}
                  history={history}
                />
              </Col>
              <Col xs={3} style={{ paddingRight: 0 }}>
                <UserStuff />
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
  const currentPage = menu.find((item) => {
    return (
      item.name.toLowerCase() ===
      pathname.substring(1, pathname.length).toLowerCase()
    );
  });

  const handleClick = (item) => {
    history.push(item.route);
  };

  const isCurrentPage = (label) => {
    if (!currentPage) {
      return false;
    }
    return currentPage && currentPage.label === label;
  };

  if (large) {
    return (
      <HStack>
        {menuItems.map((item) => (
          <CBox as="button" key={item.label} onClick={() => handleClick(item)}>
            <Text
              m="1"
              style={{
                borderBottom: isCurrentPage(item.label) ? '1px solid' : 'none',
              }}
            >
              {item.label}
            </Text>
          </CBox>
        ))}
      </HStack>
    );
  }

  return (
    <CMenu closeOnSelect>
      <MenuButton>
        <HStack>
          <Text>{(currentPage && currentPage.label) || 'Menu'}</Text>
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

const FooterInfo = ({ currentHost }) =>
  currentHost && (
    <Footer pad="medium" direction="row" justify="center">
      <Box alignSelf="center">
        <Heading level={4} style={boldBabe}>
          {currentHost.name}
        </Heading>
        <Paragraph>
          {currentHost.address}, {currentHost.city}
        </Paragraph>
        <Paragraph>
          <Anchor href={`mailto:${currentHost.email}`}>
            {currentHost.email}
          </Anchor>
        </Paragraph>
      </Box>
    </Footer>
  );

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
