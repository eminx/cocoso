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
    link: '/group/jGP7McurY8KAsvwHc'
  },
  {
    title: 'Pinery Jam Sessions',
    count: 3,
    link: '/booking/3jBTEHSwtqpxbKvSL'
  },
  {
    title: 'Amazing Workshop',
    count: 2,
    link: '/group/iAf8QzPLNBNHexX82'
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

    const menuIconStyle = {
      fontSize: 24,
      padding: '18px 12px',
      cursor: 'pointer',
      marginLeft: 18
    };

    return (
      <div className="main-viewport">
        {/* <Drawer
          // title="MENU"
          placement="right"
          onClose={this.closeMenu}
          visible={this.state.menuOpen}
          closable
        >
          <Menu
            mode="inline"
            onClick={this.closeMenu}
            style={{ borderRight: 'none' }}
          >
            <MenuItemGroup key="making-it-work" title="MAKING IT WORK">
              <MenuItem key="calendar">
                <Link to="/">
                  <b>Calendar</b>
                </Link>
              </MenuItem>

              <MenuItem key="new-booking">
                <Link to="/new-booking">
                  <b>Book</b>
                </Link>
              </MenuItem>

              <MenuItem key="documents">
                <Link to="/documents">
                  <b>Documents</b>
                </Link>
              </MenuItem>
            </MenuItemGroup>

            <MenuItem key="divider-2" style={{ padding: 0, margin: 0 }}>
              <Divider style={{ padding: 0 }} />
            </MenuItem>

            <MenuItemGroup key="the-school" title="THE SCHOOL">
              <MenuItem key="groups">
                <Link to="/groups">
                  <b>Groups</b>
                </Link>
              </MenuItem>

              <MenuItem key="new-group">
                <Link to="/new-group">
                  <b>New Group</b>
                </Link>
              </MenuItem>

              <MenuItem key="about-the-school">
                <Link to="/about-the-school">
                  <b>About the School</b>
                </Link>
              </MenuItem>
            </MenuItemGroup>

            <MenuItem key="divider-3" style={{ padding: 0, margin: 0 }}>
              <Divider style={{ padding: 0 }} />
            </MenuItem>

            <MenuItem key="my-profile">
              <Link to="/my-profile">
                <b>My Profile</b>
              </Link>
            </MenuItem>

            {currentUser && currentUser.isSuperAdmin && (
              <MenuItem key="divider-4" style={{ padding: 0, margin: 0 }}>
                <Divider style={{ padding: 0 }} />
              </MenuItem>
            )}
            {currentUser && currentUser.isSuperAdmin && (
              <MenuItemGroup key="admin" title="ADMIN">
                <MenuItem key="pages">
                  <Link to="/new-page">
                    <b>New Page</b>
                  </Link>
                </MenuItem>

                <MenuItem key="users">
                  <Link to="/users">
                    <b>Users</b>
                  </Link>
                </MenuItem>
              </MenuItemGroup>
            )}
          </Menu>
        </Drawer> */}

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
              {/* <div
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
                  <Badge count={3}>
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
              </div> */}
            </Col>
          </Row>
        </div>

        <div className="skogen-menu-layout">
          <Link to="/">
            <b>Calendar</b>
          </Link>

          <Link to="/groups">
            <b>Groups</b>
          </Link>

          <Link to="/documents">
            <b>Documents</b>
          </Link>
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
