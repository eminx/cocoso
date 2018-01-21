import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Link } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

const LayoutContainer = ({children}) => {
  return (
    <Layout className="layout">
      <Header style={{backgroundColor: '#fff'}}>
        <div className="logo" />
        <Blaze template="loginButtons" />
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px', float: 'right' }}
        >
          <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/create-a-gathering">Create</Link></Menu.Item>
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