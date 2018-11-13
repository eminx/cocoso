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
  Popover
} from 'antd/lib';
const { Header, Content, Footer } = Layout;
const MenuItem = Menu.Item;
const MenuItemGroup = Menu.ItemGroup;

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

  toggleNotificationsPopover = () => {
    this.setState({
      isNotificationPopoverOpen: !this.state.isNotificationPopoverOpen
    });
  };

  render() {
    const { children, currentUser } = this.props;

    const menuIconStyle = {
      fontSize: 24,
      padding: '18px 12px',
      cursor: 'pointer'
    };

    return (
      <div>
        <Drawer
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
        </Drawer>

        <Layout className="layout">
          <Header
            style={{
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Link to="/">
              <div className="logo skogen-logo" />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Popover
                placement="bottom"
                title="Notifications"
                content="bla bla"
              >
                <div style={{ paddingRight: 18 }}>
                  <Badge count={3}>
                    <Icon
                      onClick={this.toggleNotificationsPopover}
                      theme="outlined"
                      type="bell"
                      style={{ fontSize: 24, cursor: 'pointer' }}
                    />
                  </Badge>
                </div>
              </Popover>
              <Icon
                onClick={this.openMenu}
                theme="outlined"
                type="menu-fold"
                style={menuIconStyle}
              />
            </div>
          </Header>

          <Content style={{ marginTop: 20 }}>{children}</Content>

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
