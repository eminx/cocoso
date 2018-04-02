import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd/lib';
import Blaze from 'meteor/gadicc:blaze-react-component';
const { Header, Content, Footer } = Layout;

class LayoutContainer extends React.Component {
  componentWillMount() {
    Accounts.ui.config({
      passwordSignupFields: 'USERNAME_AND_EMAIL'
    });
  }
  
  render() {

    const { match, children } = this.props;
    const pathname = match.location.pathname;

    return (
      <div>
        <Layout className="layout">
          <Header style={{backgroundColor: '#fff'}}>
            <Menu
              selectedKeys={[pathname]}
              mode="horizontal"
              style={{ lineHeight: '64px', float: 'right' }}
            >
              <Menu.Item key="/create">
                <Link to="/create">Create</Link>
              </Menu.Item>
            </Menu>
            <Link to="/">
              <h1 className="ub-logo">Urban Burn Events</h1>
            </Link>
          </Header>
          <Content style={{ marginTop: 20 }}>
            <div style={{margin: '1em'}}>
              <Blaze template="loginButtons" />
            </div>
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