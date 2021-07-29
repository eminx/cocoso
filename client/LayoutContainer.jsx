import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
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
  Text,
  TextInput,
  TextArea,
} from 'grommet';
import { Close } from 'grommet-icons/icons/Close';
import { Down } from 'grommet-icons/icons/Down';
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

function LayoutPage({
  currentUser,
  currentHost,
  userLoading,
  hostLoading,
  history,
  children,
}) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
      <ChakraProvider>
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
  const [open, setOpen] = useState(false);

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

  const menuProps = {
    large,
    history,
  };

  const pathname = history.location.pathname;
  const currentPage = menu.find((item) => {
    return (
      item.name.toLowerCase() ===
      pathname.substring(1, pathname.length).toLowerCase()
    );
  });

  if (large) {
    return (
      <MenuContent currentPage={currentPage} items={menuItems} {...menuProps} />
    );
  }

  return (
    <DropButton
      label={
        <Box direction="row" gap="small" align="center">
          <Anchor as="span">
            {(currentPage && currentPage.label) || 'Menu'}
          </Anchor>
          <Down size="small" />
        </Box>
      }
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      alignSelf="center"
      dropContent={
        <Box width="small" pad="small">
          <MenuContent
            {...menuProps}
            items={menuItems}
            closeMenu={() => setOpen(false)}
          />
        </Box>
      }
      dropProps={{ align: { top: 'bottom' } }}
      plain
    />
  );
};

const MenuContent = ({ items, large, history, closeMenu, currentPage }) => {
  if (!items) {
    return null;
  }

  const handleClick = (item) => {
    !large && closeMenu();
    history.push(item.route);
  };

  const isCurrentPage = (label) => {
    if (!currentPage) {
      return false;
    }
    if (currentPage.label === 'info') {
      return label.substring(0, 5) === '/page';
    }
    return currentPage && currentPage.label === label;
  };

  return (
    <Box
      pad="small"
      justify={large ? 'center' : 'start'}
      direction={large ? 'row' : 'column'}
      flex={{ shrink: 0 }}
      alignSelf="center"
      wrap
      gap={large ? 'none' : 'small'}
    >
      {items.map((item) => (
        <Box pad="small" key={item.label}>
          <Anchor
            onClick={() => handleClick(item)}
            label={item.label.toUpperCase()}
            size="small"
            style={{
              borderBottom: isCurrentPage(item.label) ? '1px solid' : 'none',
            }}
          />
        </Box>
      ))}
    </Box>
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
