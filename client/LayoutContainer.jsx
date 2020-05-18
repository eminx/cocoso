import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Anchor, Heading, Paragraph, Footer } from 'grommet';

export const UserContext = React.createContext(null);

import UserPopup from './UIComponents/UserPopup';
import NotificationsPopup from './UIComponents/NotificationsPopup';
import { call } from './functions';

const menu = [
  {
    label: 'Marketplace',
    route: '/market'
  },
  {
    label: 'Calendar',
    route: '/calendar'
  },
  {
    label: 'Groups',
    route: '/groups'
  },
  {
    label: 'Info',
    route: `/page/about`
  }
];

const LayoutPage = ({ currentUser, userLoading, history, children }) => {
  // const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(
  //   false
  // );
  const [currentHost, setCurrentHost] = useState({});

  const getHost = async () => {
    const respond = await call('getHostSettings');
    setCurrentHost(respond);
  };

  useEffect(() => {
    getHost();
  }, []);

  const settings = currentHost;

  const headerProps = {
    currentUser,
    history,
    title: 'Cic Network'
  };

  return (
    <UserContext.Provider value={{ currentUser, userLoading, settings }}>
      <Box className="main-viewport" justify="center" fill>
        <Box width={{ max: '1280px' }} alignSelf="center" fill>
          <Header {...headerProps} />
          <Box>{children}</Box>
          {/* <FooterInfo settings={settings} /> */}
        </Box>
      </Box>
    </UserContext.Provider>
  );
};

const boldBabe = {
  textTransform: 'uppercase',
  fontWeight: 700
};

const Header = ({ currentUser, title, history }) => {
  const pathname = history.location.pathname;

  return (
    <Box
      justify="between"
      direction="row"
      pad={{
        right: 'medium',
        bottom: 'small',
        left: 'medium'
      }}
      fill="horizontal"
      wrap
    >
      <Box basis="200px"></Box>
      <Box
        pad="small"
        justify="center"
        direction="row"
        flex={{ shrink: 0 }}
        alignSelf="center"
      >
        {menu.map(item => (
          <Box pad="small" key={item.label}>
            <Anchor
              onClick={() => history.push(item.route)}
              label={item.label}
            />
          </Box>
        ))}
      </Box>
      <Box basis="200px" justify="end" direction="row" alignContent="center">
        {currentUser && (
          <NotificationsPopup notifications={currentUser.notifications} />
        )}
        <UserPopup currentUser={currentUser} />
      </Box>
    </Box>
  );
};

const FooterInfo = ({ settings }) =>
  settings && (
    <Footer pad="medium" direction="row" justify="center">
      <Box alignSelf="center">
        <Heading level={4} style={boldBabe}>
          {settings.name}
        </Heading>
        <Paragraph>
          {settings.address}, {settings.city}
        </Paragraph>
        <Paragraph>
          <Anchor href={`mailto:${settings.email}`}>{settings.email}</Anchor>
        </Paragraph>
      </Box>
    </Footer>
  );

export default withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const userLoading = !meSub.ready();

  return {
    currentUser,
    userLoading
  };
})(LayoutPage);
