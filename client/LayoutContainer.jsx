import React from 'react';
import { Link } from 'react-router-dom';

import { Drawer, Layout, Divider, Menu, Icon } from 'antd/lib';
const { Header, Content, Footer } = Layout;
const MenuItem = Menu.Item;

class LayoutContainer extends React.Component {
  state = {
    menuOpen: false
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

  render() {
    const { history, children } = this.props;
    const pathname = history.location.pathname;
    const currentUser = Meteor.userId();

    return (
      <div>
        <Drawer
          title="MENU"
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
            <MenuItem key="/">
              <Link to="/">
                <b>Home</b>
              </Link>
            </MenuItem>

            <MenuItem key="new-booking">
              <Link to="/new-booking">
                <b>New Booking</b>
              </Link>
            </MenuItem>

            <MenuItem key="divider-1" style={{ padding: 0, margin: 0 }}>
              <Divider style={{ padding: 0 }} />
            </MenuItem>

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

            <MenuItem key="divider-2" style={{ padding: 0, margin: 0 }}>
              <Divider style={{ padding: 0 }} />
            </MenuItem>

            <MenuItem key="my-profile">
              <Link to="/my-profile">
                <b>My Profile</b>
              </Link>
            </MenuItem>
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
            {pathname === '/' ? (
              <Link to="/">
                <div className="logo skogen-logo" />
              </Link>
            ) : (
              <div
                className="logo"
                onClick={history.goBack}
                style={{ cursor: 'pointer' }}
              >
                <Icon
                  style={{ fontSize: 36, color: '#2e3880' }}
                  type="arrow-left"
                />
              </div>
            )}

            {currentUser ? (
              <Icon
                onClick={this.openMenu}
                theme="outlined"
                type="menu-fold"
                theme="outlined"
                style={{ fontSize: 24, padding: 18, cursor: 'pointer' }}
              />
            ) : (
              <Link to="/my-profile">Signin / Signup</Link>
            )}
          </Header>

          <Content style={{ marginTop: 20 }}>{children}</Content>

          <Footer style={{ textAlign: 'center' }} />
        </Layout>
      </div>
    );
  }
}

export default LayoutContainer;
