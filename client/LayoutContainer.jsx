import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const UserContext = React.createContext(null);

const publicSettings = Meteor.settings.public;

import { Layout, Icon, Badge, Popover, List, Row, Col } from 'antd/lib';
const { Content } = Layout;

import { Box, Anchor, Heading } from 'grommet';
import Loader from './UIComponents/Loader';

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
    route: `/page/about-${publicSettings.contextSlug}`
  }
];

const adminMenu = [
  {
    label: 'Admin',
    route: '/admin/settings'
  }
];

class LayoutPage extends React.Component {
  state = {
    menuOpen: false,
    me: false,
    isNotificationPopoverOpen: false
  };

  componentWillUpdate(nextProps, nextState) {
    const { history } = this.props;
    const pathname = history.location.pathname;
    if (nextProps.history.location.pathname !== pathname) {
      this.closeMenu();
    }
  }

  openMenu = () => {
    this.setState({
      menuOpen: true
    });
  };

  closeMenu = () => {
    this.setState({
      menuOpen: false
    });
  };

  handleNotificationVisibility = () => {
    this.setState({
      isNotificationPopoverOpen: !this.state.isNotificationPopoverOpen
    });
  };

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
              onClick={this.handleNotificationVisibility}
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

  render() {
    const { isNotificationPopoverOpen } = this.state;
    const {
      currentUser,
      userLoading,
      currentHost,
      hostLoading,
      children
    } = this.props;

    if (hostLoading) {
      return <Loader />;
    }

    const notifications = currentUser && currentUser.notifications;
    let notificationsCounter = 0;
    if (notifications && notifications.length > 0) {
      notifications.forEach(notification => {
        notificationsCounter += notification.count;
      });
    }

    const settings = currentHost.settings;

    return (
      <Box>
        <UserContext.Provider value={{ currentUser, userLoading, settings }}>
          <div className="main-viewport">
            <div className="header-container">
              <Row className="header-background">
                <Col xs={8}>
                  <span
                    style={{
                      padding: '6px 12px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      backgroundColor: 'rgba(255, 255, 255, .7)'
                    }}
                  >
                    <Link to="/my-profile" style={{ color: '#030303' }}>
                      {currentUser ? currentUser.username : 'LOGIN'}
                    </Link>
                  </span>
                </Col>

                <Col
                  xs={8}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Link to="/">
                    <div>
                      <Heading level={1}>{settings.name}</Heading>
                    </div>
                  </Link>
                </Col>

                <Col xs={8} style={{ textAlign: 'right' }}>
                  {notifications && (
                    <Popover
                      placement="bottomRight"
                      title="Notifications"
                      content={this.renderNotificationList(notifications)}
                      trigger="click"
                      visible={isNotificationPopoverOpen}
                      onVisibleChange={this.handleNotificationVisibility}
                    >
                      <Badge count={notificationsCounter}>
                        <Icon
                          onClick={this.toggleNotificationsPopover}
                          theme="outlined"
                          type="bell"
                          style={{ fontSize: 24, cursor: 'pointer' }}
                        />
                      </Badge>
                    </Popover>
                  )}
                </Col>
              </Row>
            </div>

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
              {currentUser &&
                currentUser.isSuperAdmin &&
                adminMenu.map(item => (
                  <Link to={item.route} key={item.label}>
                    <Box pad="small">
                      <Anchor plain as="span" pad="small">
                        {item.label}
                      </Anchor>
                    </Box>
                  </Link>
                ))}
            </Box>

            <Layout className="layout">
              <Content>{children}</Content>
            </Layout>
            <FancyFooter settings={settings} />
          </div>
        </UserContext.Provider>
      </Box>
    );
  }
}

const widgetBgrstyle = {
  textAlign: 'center',
  backgroundColor: 'rgba(255, 245, 244, .8)',
  padding: 24,
  margin: 12,
  marginTop: 32,
  maxWidth: 320
};

const boldBabe = {
  textTransform: 'uppercase',
  fontWeight: 700
};

const FancyFooter = ({ settings }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      <div style={widgetBgrstyle}>
        <FooterInfo settings={settings} />
      </div>
    </div>
  );
};

const FooterInfo = ({ settings }) =>
  settings && (
    <Fragment>
      <h4 style={boldBabe}>{settings.name}</h4>
      <p>
        {settings.address}, {settings.city}
      </p>
      <p>
        <a href={`mailto:${settings.email}`}>{settings.email}</a>
      </p>
    </Fragment>
  );

export default withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const userLoading = !meSub.ready();
  const hostSub = Meteor.subscribe('currentHost');
  const hostLoading = !hostSub.ready();
  const currentHost = Hosts ? Hosts.findOne() : null;

  return {
    currentUser,
    userLoading,
    currentHost,
    hostLoading
  };
})(LayoutPage);
