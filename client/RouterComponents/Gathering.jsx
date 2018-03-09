import React from 'react';
import { Row, Col, Spin } from 'antd/lib';
import CardArticle from '../UIComponents/CardArticle';

class Gathering extends React.Component {

  render() {

    const  { currentUser, theGathering, isLoading } = this.props;

    return (
    	<div>
    		<Row>
    			<Col span={4} />
    			<Col xs={24} sm={16}>
            {!isLoading && currentUser
              ? <CardArticle 
                  item={theGathering}
                  currentUser={currentUser}
                  isLoading={isLoading} />
              : <Spin size="large" />
            }
    			</Col>
    			<Col span={4} />
    		</Row>
      </div>
    )
  }
}

export default Gathering;