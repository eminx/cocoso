import React from 'react';
import { Card, Icon, Avatar, Row, Col } from 'antd/lib';
const { Meta } = Card;

class CardArticle extends React.Component {
	
  render() {

    const { isLoading, item } = this.props;
    if (!isLoading) {
      return (
        <Card
          title={<div><h1>{item.title}</h1><h2>{item.shortDescription}</h2></div>}
          bordered={false}
          cover={<img alt="example" src={item.imageUrl} />}
          actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
        >
          <Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={`Will be held at: ${item.room}`}
            description={item.longDescription}
          />
        </Card>
      )
    } else {
      return <Card loading />; 
    }
  }
}

export default CardArticle;