import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Link } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

const LayoutContainer = ({match, children}) => {

  const pathname = match.location.pathname;

  return (
    <Layout className="layout">
      <Header style={{backgroundColor: '#fff'}}>
        <div className="logo" />
        <Blaze template="loginButtons" />
        <Menu
          selectedKeys={[pathname]}
          mode="horizontal"
          style={{ lineHeight: '64px', float: 'right' }}
        >
          <Menu.Item key={'/'}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key={'/create-a-gathering'}>
            <Link to="/create-a-gathering">Create</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ marginTop: 20 }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        
      </Footer>
    </Layout>
  )
}

export default LayoutContainer;