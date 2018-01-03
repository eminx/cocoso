import React from 'react';
import Nodal from '../UIComponents/Nodal';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { Layout, Menu } from 'antd';
const { Header, Content, Footer } = Layout;

class Home extends React.Component {
  state = {subID: 1};
 
  incrementSubID = () => {
    this.setState({subID: this.state.subID + 1});
  }
 
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
            <Blaze template="loginButtons" />
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Nodal subID={this.state.subID} />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2016 Created by Ant UED
        </Footer>
      </Layout>
      
    )
  }
}

export default Home;