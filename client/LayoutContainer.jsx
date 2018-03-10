import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd/lib';
const { Header, Content, Footer } = Layout;

class LayoutContainer extends React.Component {
  
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
              <Menu.Item key="/create-a-gathering">
                <Link to="/create-a-gathering">Create</Link>
              </Menu.Item>
              <Menu.Item key="/member">
                <Link to="/member">Members</Link>
              </Menu.Item>
            </Menu>
            <Link to="/">
              <div className="logo" />
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