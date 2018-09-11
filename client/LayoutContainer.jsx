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
            <MenuItem key="new-booking">
              <Link to="/new-booking">New Booking</Link>
            </MenuItem>
            <MenuItem key="new-group">
              <Link to="/new-group">New Group</Link>
            </MenuItem>
            <MenuItem key="groups">
              <Link to="/groups">Groups</Link>
            </MenuItem>
            <MenuItem key="loginButtons">
              <Blaze template="loginButtons" />
            </MenuItem>
          </Menu>
        </Drawer>

        <Layout className="layout">
          <Header style={{backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between'}}>
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

            <Icon onClick={this.openMenu} theme="outlined" type="menu-fold" theme="outlined" style={{fontSize: 24, padding: 18, cursor: 'pointer'}} />
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