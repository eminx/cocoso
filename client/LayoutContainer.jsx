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
const MenuItem = Menu.Item;
const MenuItemGroup = Menu.ItemGroup;

const notifications = [
  {
    title: 'Title wow',
    count: 3,
    context: 'group',
    contextId: 'jGP7McurY8KAsvwHc'
  },
  {
    title: 'Pinery Jam Sessions',
    count: 3,
    context: 'group',
    contextId: 'jGP7McurY8KAsvwHc'
  },
  {
    title: 'Amazing Workshop',
    count: 2,
    context: 'group',
    contextId: 'iAf8QzPLNBNHexX82'
  }
];

const menu = [
  {
    label: 'Making It Work',
    route: '/'
  },
  {
    label: 'Groups',
    route: '/groups'
  },
  {
    label: 'Community Press',
    route: '/publications'
  }
];

const adminMenu = [
  {
    label: 'Users',
    route: '/users'
  }
];

const NotificationList = ({ list }) => (
  <List
    size="small"
    dataSource={list}
    renderItem={item => (
      <Link
        to={item.link}
        onClick={() => this.handleNotificationVisibility(false)}
      >
        <List.Item>{item.title}</List.Item>
      </Link>
    )}
  />
);

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

  handleNotificationVisibility = visibleValue => {
    this.setState({
      isNotificationPopoverOpen: visibleValue
    });
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  color: '#030303'
                }}
              >
                <Popover
                  placement="bottom"
                  title="Notifications"
                  content={<NotificationList list={notifications} />}
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
                <Icon
                  onClick={this.openMenu}
                  theme="outlined"
                  type="menu-fold"
                  style={menuIconStyle}
                />
              </div>
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

          <Footer style={{ textAlign: 'center' }} />
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
