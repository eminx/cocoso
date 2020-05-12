import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, List } from 'antd/lib';
import { Box, Anchor, Heading, Paragraph, Footer } from 'grommet';

export const UserContext = React.createContext(null);

import Loader from './UIComponents/Loader';
import UserPopup from './UIComponents/UserPopup';
import NotificationsPopup from './UIComponents/NotificationsPopup';
import { call } from './functions';

const menu = [
  {
    label: 'Home',
    route: '/'
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

const LayoutPage = ({ currentUser, userLoading, children }) => {
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(
    false
  );
  const [currentHost, setCurrentHost] = useState({});

  const getHost = async () => {
    const respond = await call('getHostSettings');
    setCurrentHost(respond);
  };

  useEffect(() => {
    getHost();
  });

  renderNotificationList = list => {
    if (list.length === 0) {
      return <em>You don't have unread messages</em>;
    }

    return (
      <List
        size="small"
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Link
              to={`/${item.context}/${item.contextId}`}
              onClick={setIsNotificationPopoverOpen(!isNotificationPopoverOpen)}
            >
              <Badge count={item.count} offset={[10, 0]}>
                <h4>{item.title}</h4>
              </Badge>
            </Link>
          </List.Item>
        )}
      />
    );
  };

  const notifications = currentUser && currentUser.notifications;
  let notificationsCounter = 0;
  if (notifications && notifications.length > 0) {
    notifications.forEach(notification => {
      notificationsCounter += notification.count;
    });
  }

  const settings = currentHost;

  return (
    <UserContext.Provider value={{ currentUser, userLoading, settings }}>
      <Box className="main-viewport" justify="center" fill>
        <Box width={{ max: '1280px' }} alignSelf="center" fill>
          <Box
            justify="between"
            alignSelf="center"
            direction="row"
            pad={{
              top: 'medium',
              right: 'medium',
              bottom: 'small',
              left: 'medium'
            }}
            fill="horizontal"
          >
            <Box basis="120px" />
            <Box justify="center">
              <Link to="/">
                <Heading level={1} style={{ marginBottom: 0 }}>
                  Cic Network
                </Heading>
              </Link>
            </Box>

            <Box
              basis="120px"
              justify="end"
              direction="row"
              alignContent="center"
            >
              {notifications && (
                <NotificationsPopup>
                  {this.renderNotificationList(notifications)}
                </NotificationsPopup>
              )}
              <UserPopup currentUser={currentUser} />
            </Box>
          </Box>

          <Box pad="small" justify="center" direction="row">
            {menu.map(item => (
              <Link to={item.route} key={item.label}>
                <Box pad="small">
                  <Anchor plain as="span">
                    {item.label}
                  </Anchor>
                </Box>
              </Link>
            ))}
          </Box>

          <Box>{children}</Box>
          <FancyFooter settings={settings} />
        </Box>
      </Box>
    </UserContext.Provider>
  );
};

const boldBabe = {
  textTransform: 'uppercase',
  fontWeight: 700
};

const FancyFooter = ({ settings }) => {
  return (
    <Box>
      <FooterInfo settings={settings} />
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
