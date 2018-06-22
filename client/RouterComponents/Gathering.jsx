import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Spin, Button, Icon, Divider, Checkbox, List, Avatar, Affix, Popconfirm, message } from 'antd/lib';
import CardArticle from '../UIComponents/CardArticle';
import { ChatFeed, Message } from 'react-chat-ui';
const ListItem = List.Item;

class Gathering extends React.Component {

  render() {
    const { gatheringData, isLoading, currentUser } = this.props;

    return (
    	<div>
        { !isLoading && gatheringData
          ?
        		<Row gutter={24}>
              <Col sm={24} md={16}>
                <CardArticle 
                  item={gatheringData}
                  isLoading={isLoading}
                  currentUser={currentUser}
                />
        			</Col>

              <Col sm={24} md={8}>
                { currentUser && currentUser._id === gatheringData.authorId
                  ?
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <Link to={`/edit-booking/${gatheringData._id}`}><Button>Edit</Button></Link>
                    </div>
                  : null
                }
                  
              </Col>
        		</Row>
          :
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Spin size="large" />
            </div>
        }
      </div>
    )
  }
}

export default Gathering;