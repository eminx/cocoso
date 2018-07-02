import React from 'react';
import { Link } from 'react-router-dom';
import Chattery from '../chattery';
import { Row, Col,  Spin, Button, Icon, Divider, Checkbox, List, Avatar, Affix, Popconfirm, message } from 'antd/lib';
import CardArticle from '../UIComponents/CardArticle';
const ListItem = List.Item;

class Gathering extends React.Component {

  addNewChatMessage = (message) => {
    Meteor.call('addChatMessage', this.props.gatheringData._id, message, (error, respond) => {
      if (error) {
        console.log('error', error);
      }
    });
  }

  render() {
    const { gatheringData, isLoading, currentUser, chatData } = this.props;

    const EditButton = currentUser && gatheringData && currentUser._id === gatheringData.authorId 
      ?
        <div style={{display: 'flex', justifyContent: 'center', position: 'absolute', top: 20, right: 30}}>
          <Link to={`/edit-booking/${gatheringData._id}`}><Button>Edit</Button></Link>
        </div>
      : null

    let messages = [];
    if (chatData) {
      messages = chatData.messages;
      messages.forEach((message) => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return (
    	<div>
        { !isLoading && gatheringData
          ?
        		<Row gutter={24}>
              <Col sm={24} md={16} style={{position: 'relative'}}>
                <CardArticle 
                  item={gatheringData}
                  isLoading={isLoading}
                  currentUser={currentUser}
                />
                {EditButton}
        			</Col>

              
        		</Row>
          :
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Spin size="large" />
            </div>
        }
        <Divider />
        <Row gutter={24}>
          <Col sm={24} md={20} lg={16}>
            { 
              chatData ?
                <div>
                  <h2>Chat Section</h2>
                  <Chattery
                    messages={messages}
                    onNewMessage={this.addNewChatMessage}
                  />
                </div>
              : null
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default Gathering;