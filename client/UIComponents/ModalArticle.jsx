import React from 'react';
import { Modal, Card, Icon, Avatar, Spin } from 'antd/lib';
const { Meta } = Card;

class ModalArticle extends React.Component {
	
  render() {

    const { isLoading, item } = this.props;

    return (
      <Spin spinning={isLoading}>
        <Modal
          {...this.props} style={{top: 20}} > 
          <Card
            title={<div><h1>{item.title}</h1><h2>{item.shortDescription}</h2></div>}
            bordered={false}
            cover={<img alt="example" src="https://pre00.deviantart.net/0300/th/pre/i/2015/096/9/1/coldstone_mountains_by_newmand-d5n1xqw.jpg" />}
            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={`Will be held at: ${item.room}`}
              description={item.longDescription}
            />
          </Card>
        </Modal>
      </Spin>
    )
  }
}

export default ModalArticle;