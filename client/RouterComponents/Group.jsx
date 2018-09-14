import React from 'react';
import { Link } from 'react-router-dom';
import Chattery from '../chattery';
import { Row, Col,  Spin, Button, Icon, Divider, Checkbox, List, Avatar, Affix, Popconfirm, message } from 'antd/lib';
import CardArticle from '../UIComponents/CardArticle';
const ListItem = List.Item;

class Group extends React.Component {

  addNewChatMessage = (message) => {
    Meteor.call('addChatMessage', this.props.groupData._id, message, (error, respond) => {
      if (error) {
        console.log('error', error);
      }
    });
  }

  getChatMessages = () => {
    const { chatData, currentUser } = this.props;
    
    let messages = [];

    if (chatData) {
      messages = [...chatData.messages];
      messages.forEach((message) => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return messages;
  }

  render() {
    const { groupData, isLoading, currentUser, chatData } = this.props;

    const EditButton = currentUser && groupData && currentUser._id === groupData.authorId 
      ?
        <div style={{display: 'flex', justifyContent: 'center', position: 'absolute', top: 20, right: 30}}>
          <Link to={`/edit-group/${groupData._id}`}><Button>Edit</Button></Link>
        </div>
      : null

    const messages = this.getChatMessages();

    const titleStyle = {
      marginLeft: 24,
      fontWeigth: 300,
      color: '#0g0g0g'
    }

    return (
    	<div>
        { !isLoading && groupData
          ?
        		<Row gutter={24}>
              <Col sm={24} md={16} style={{position: 'relative'}}>
                <CardArticle 
                  item={groupData}
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
          <Col sm={24} md={16}>

            <h4 style={titleStyle}>Chat Section</h4>  
            { chatData &&  
              <Chattery
                messages={messages}
                onNewMessage={this.addNewChatMessage}
              />
            }

          </Col>
        </Row>
      </div>
    )
  }
}

export default Group;