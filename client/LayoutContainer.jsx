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
  Heading,
  Image,
  Paragraph,
  Text,
} from 'grommet';
import { FormPrevious, Down } from 'grommet-icons';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';

export const StateContext = React.createContext(null);

import UserPopup from './UIComponents/UserPopup';
import NotificationsPopup from './UIComponents/NotificationsPopup';

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

const LayoutPage = ({
  currentUser,
  currentHost,
  userLoading,
  hostLoading,
  history,
  children,
}) => {
  // const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(
  //   false
  // );

  if (hostLoading) {
    return (
      <Box width="100%">
        <Box pad="medium" alignSelf="center">
          <Text>Loading...</Text>
        </Box>
      </Box>
    );
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
    <StateContext.Provider
      value={{
        currentUser,
        userLoading,
        currentHost,
        role,
        canCreateContent,
      }}
    >
      <Box className="main-viewport" justify="center" fill background="light-2">
        <Box width={{ max: '1280px' }} alignSelf="center" fill>
          <Header {...headerProps} />
          <Box>{children}</Box>
          {/* <FooterInfo settings={settings} /> */}
        </Box>
      </Box>
    </StateContext.Provider>
  );
};

const boldBabe = {
  textTransform: 'uppercase',
  fontWeight: 700,
};

const Header = ({ currentUser, currentHost, title, history }) => {
  const UserStuff = () => (
    <Box justify="end" direction="row" alignContent="center">
      {currentUser && (
        <NotificationsPopup notifications={currentUser.notifications} />
      )}
      <UserPopup currentUser={currentUser} />
    </Box>
  );

  const pathname = location.pathname;
  const gotoPath = getGotoPath(pathname);

  return (
    <ScreenClassRender
      render={(screenClass) => {
        const large = ['lg', 'xl', 'xxl'].includes(screenClass);

        return (
          <Container fluid style={{ width: '100%' }}>
            <Row style={{ marginLeft: 0, marginRight: 0 }} align="center">
              <Col xs={3}>
                <Box>
                  {!pathsWithMenu.includes(pathname) ? (
                    <Link to={gotoPath}>
                      <Button
                        plain
                        icon={<FormPrevious size="large" />}
                        style={{ transform: 'translateX(-16px)' }}
                      />
                    </Link>
                  ) : (
                    <Link to="/">
                      <Box
                        width="120px"
                        height="80px"
                        margin={{ top: 'small' }}
                      >
                        <Image
                          fit="contain"
                          src={currentHost && currentHost.logo}
                          className="header-logo"
                        />
                      </Box>
                    </Link>
                  )}
                </Box>
              </Col>
              <Col xs={6} style={{ display: 'flex', justifyContent: 'center' }}>
                {pathsWithMenu.includes(pathname) && (
                  <Menu large={large} history={history} />
                )}
              </Col>
              <Col xs={3}>
                <UserStuff />
              </Col>
            </Row>
          </Container>
        );
      }}
    />
  );
};

const Menu = ({ large, history }) => {
  const [open, setOpen] = useState(false);

  const menuProps = {
    large,
    history,
  };

  if (large) {
    return <MenuContent {...menuProps} />;
  }

  const pathname = history.location.pathname;
  const currentPage = menu.find(
    (item) =>
      item.label.toLowerCase() ===
      pathname.substring(1, pathname.length).toLowerCase()
  );

  return (
    <DropButton
      label={
        <Box direction="row" gap="small" align="center">
          <Text>{(currentPage && currentPage.label) || 'Menu'}</Text>
          <Down size="small" />
        </Box>
      }
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      alignSelf="center"
      dropContent={
        <MenuContent {...menuProps} closeMenu={() => setOpen(false)} />
      }
      dropProps={{ align: { top: 'bottom' } }}
      plain
    />
  );
};

const MenuContent = ({ large, history, closeMenu }) => {
  const handleClick = (item) => {
    closeMenu();
    history.push(item.route);
  };

  return (
    <Box
      pad="small"
      justify={large ? 'center' : 'start'}
      direction={large ? 'row' : 'column'}
      flex={{ shrink: 0 }}
      alignSelf="center"
      wrap
    >
      {menu.map((item) => (
        <Box pad="small" key={item.label}>
          <Anchor onClick={() => handleClick(item)} label={item.label} />
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
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const userLoading = !meSub.ready();

  const hostSub = Meteor.subscribe('currentHost');
  const currentHost = Hosts ? Hosts.findOne() : null;
  const hostLoading = !hostSub.ready();
  return {
    currentUser,
    currentHost,
    userLoading,
    hostLoading,
  };
})(LayoutPage);
