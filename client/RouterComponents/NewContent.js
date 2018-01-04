import React from 'react';
import Nodal from '../UIComponents/Nodal';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

class NewContent extends React.Component {
 
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Blaze template="loginButtons" />
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px', float: 'right' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Nodal />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          
        </Footer>
      </Layout>
      
    )
  }
}

export default NewContent;