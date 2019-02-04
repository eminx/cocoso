import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link } from 'react-router-dom';

import {
  Drawer,
  Layout,
  Divider,
  Menu,
  Icon,
  Spin,
  Badge,
  Popover,
  List,
  Row,
  Col
} from 'antd/lib';
const { Header, Content, Footer } = Layout;

const menu = [
  {
    label: 'Program',
    route: '/'
  },
  {
    label: 'Making It Work',
    route: '/calendar'
  },
  {
    label: 'Groups',
    route: '/groups'
  },
  {
    label: 'Community Press',
    route: '/publications'
  },
  {
    label: 'Info',
    route: '/page/about-skogen'
  }
];

const adminMenu = [
  {
    label: 'Users',
    route: '/users'
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
    const { children, currentUser } = this.props;

    const notifications = currentUser && currentUser.notifications;
    let notificationsCounter = 0;
    if (notifications && notifications.length > 0) {
      notifications.forEach(notification => {
        notificationsCounter += notification.count;
      });
    }

    const menuIconStyle = {
      fontSize: 24,
      padding: '18px 12px',
      cursor: 'pointer',
      marginLeft: 18
    };

    return (
      <div className="main-viewport">
        <div className="header-container">
          <Row className="header-background">
            <Col xs={8} />

            <Col xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/">
                <div className="logo skogen-logo" />
              </Link>
            </Col>

            <Col xs={8}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span
                  style={{
                    textAlign: 'right',
                    padding: '6px 12px',
                    color: '#030303',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255, 255, 255, .7)'
                  }}
                >
                  <Link to="/my-profile">
                    {currentUser ? currentUser.username : 'LOGIN'}
                  </Link>
                </span>
              </div>
              {notifications && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: '#030303',
                    margin: '24px 12px'
                  }}
                >
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
                </div>
              )}
            </Col>
          </Row>
        </div>

        <div className="skogen-menu-layout">
          {menu.map(item => (
            <Link to={item.route} key={item.label}>
              <b>{item.label}</b>
            </Link>
          ))}
          {currentUser &&
            currentUser.isSuperAdmin &&
            adminMenu.map(item => (
              <Link to={item.route} key={item.label}>
                <b>{item.label}</b>
              </Link>
            ))}
        </div>

        <Layout className="layout">
          <Content>{children}</Content>

          <Footer style={{ borderTop: '1px dashed #030303' }}>
            <p>
              <b>SKOGEN</b>
            </p>
            <p>
              Adres: Skogen, Masthuggsterrassen 3, SE-413 18 Göteborg, Sweden
            </p>
            <p>Tel. +46 31-409 862</p>
            <p>
              E-mail: <a href="mailto:info@skogen.pm">info@skogen.pm</a>
            </p>
            <p>
              Facebook:{' '}
              <a href="https://www.facebook.com/skogen.pm" target="_blank">
                www.facebook.com/skogen.pm
              </a>
              <br />
              (opens in a new tab)
            </p>
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default (LayoutContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  return {
    currentUser
  };
})(LayoutPage));
