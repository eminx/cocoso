import React from 'react';
import { Modal, Card, Icon, Avatar, Spin } from 'antd/lib';
const { Meta } = Card;

class ModalArticle extends React.Component {
	
  render() {

    const { isLoading, item, imageSrc } = this.props;

    return (
      <Spin spinning={isLoading}>
        <Modal
          {...this.props} style={{top: 20}} > 
          <Card
            title={<div><h1>{item.title}</h1><h2>{item.shortDescription}</h2></div>}
            bordered={false}
            cover={<img alt="example" src={imageSrc} />}
            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={`${item.room}, Noden`}
              description={item.longDescription}
            />
          </Card>
        </Modal>
      </Spin>
    )
  }
}

export default ModalArticle;