import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, Layout, List, Menu, Icon } from 'antd/lib';
import Blaze from 'meteor/gadicc:blaze-react-component';
const { Header, Content, Footer } = Layout;
const MenuItem = Menu.Item;

class LayoutContainer extends React.Component {
  state = {
    menuOpen: false,
  }

  componentWillUpdate(nextProps, nextState) {
    const { match } = this.props;
    const pathname = match.location.pathname;
    console.log(pathname, nextProps.match.location.pathname);
    if (nextProps.match.location.pathname !== pathname) {
      this.closeMenu();
    }
  }

  openMenu = () => {
    this.setState({
      menuOpen: true,
    });
  }

  closeMenu = () => {
    this.setState({
      menuOpen: false,
    });
  }

  render() {
    const { match, children } = this.props;
    const pathname = match.location.pathname;

    return (
      <div>
        <Drawer
          title="Menu"
          placement="right"
          onClose={this.closeMenu}
          visible={this.state.menuOpen}
          closable
        >
          <Menu
            mode="inline"
            onClick={this.closeMenu}
          >
            <MenuItem key="/">
              <Link to="/">Home</Link>
            </MenuItem>
            <MenuItem key="book">
              <Link to="/book">Book</Link>
            </MenuItem>
            <MenuItem key="groups">
              <Link to="/groups">Groups</Link>
            </MenuItem>
            <MenuItem key="profile">
              <Blaze template="loginButtons" />
            </MenuItem>
          </Menu>
        </Drawer>

        <Layout className="layout">
          <Header style={{backgroundColor: '#fff'}}>
            <Menu
              selectedKeys={[pathname]}
              mode="horizontal"
              style={{ lineHeight: '64px', float: 'right' }}
            >
              {/*<Menu.Item key="/bookings">
                <Link to="/">Bookings</Link>
              </Menu.Item>*/}
              {/*<Menu.Item key="/create">
                <Link to="/book">Book</Link>
              </Menu.Item>
              <Menu.Item key="/login">
                <Blaze template="loginButtons" />
              </Menu.Item>*/}
              <MenuItem key="menu-icon" onClick={this.openMenu}>
                <Icon theme="outlined" type="menu-fold" theme="outlined" />
              </MenuItem>
            </Menu>

            <Link to="/">
              { pathname === '/'
                ?
                  <div className="logo skogen-logo" />
                : 
                  <div className="logo">
                    <Icon style={{fontSize: 36, color: '#2e3880'}} type="arrow-left" />
                  </div>
              }
            </Link>
          </Header>

          <Content style={{ marginTop: 20 }}>
            {children}
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            
          </Footer>
        </Layout>
      </div>
    )
  }
}

export default LayoutContainer;