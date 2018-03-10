import React from 'react';
import { Row, Col, Spin, Checkbox, List, Avatar, message } from 'antd/lib';
import CardArticle from '../UIComponents/CardArticle';
const ListItem = List.Item;

class Gathering extends React.Component {
  state= {
    isAttending: false
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading, currentUser } = this.props;
    if (prevProps.isLoading && !isLoading) {
      this.setIsAttending();
    } else if (currentUser && currentUser.attending && prevProps.currentUser && prevProps.currentUser.attending) {
      if (currentUser.attending.length !== prevProps.currentUser.attending.length) {
        this.setIsAttending();
        console.log('geliyor');
      }
    }
  }

  checkIfAttending = () => {
    const { gatheringData, currentUser } = this.props;
    let isAttending = false;
    if (currentUser.attending) {
      for (let event of currentUser.attending) {
        if (event.gatheringId === gatheringData._id) {
          isAttending = true;
        }
      }
    }
    return isAttending;
  }

  setIsAttending = () => {
    const isAttending = this.checkIfAttending();
    this.setState({
      isAttending: isAttending
    });
  }

  signupComing = () => {
    const { isAttending } = this.state;
    const { gatheringData } = this.props;
    if (!isAttending && gatheringData) {
      Meteor.call('registerAttendance', gatheringData._id, (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          message.success("You're successfully registered!");
        }
      });
    } else {
      message.error("You've already signed up!");
    }
  }

  signupNotComing = () => {
    const { isAttending } = this.state;
    const { gatheringData } = this.props;
    if (isAttending && gatheringData) {
      const gatheringId = gatheringData._id;
      Meteor.call('unRegisterAttendance', gatheringId, (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          message.info("Sad that you aren't coming, but thanks for letting us know!");
        }
      });
    } else {
      message.error("OK! We get that you won't come");
    }
  }

  toggleAttendance = (userId, e) => {
    const { gatheringData } = this.props;
    e.preventDefault();
    Meteor.call('toggleAttendanceAsHost', gatheringData._id, userId, (err, res) => {
      if (err) {
        message.error("It didn't work :/");
        console.log(err);
      } else {
        console.log('fixed');
      }
    });
  }

  render() {

    const { gatheringData, isLoading, currentUser } = this.props;
    const { isAttending } = this.state;
    const isMyEventWTF = currentUser && gatheringData ? gatheringData.authorId === currentUser._id : false;

    return (
    	<div>
    		<Row gutter={24}>
    			<Col sm={24} md={16}>
            {!isLoading && gatheringData
              ? <CardArticle 
                  item={gatheringData}
                  isLoading={isLoading}
                  isAttending={isAttending}
                  isMyEventWTF={isMyEventWTF}
                  signupComing={this.signupComing}
                  signupNotComing={this.signupNotComing}
                />
              : <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Spin size="large" />
                </div>
            }
    			</Col>
    			<Col sm={24} md={8}>
            { isMyEventWTF 
              ?
                gatheringData.attendees.length > 0 
                  ?
                    <div style={{padding: 12}}>
                      <h3>Attendees</h3>
                      <p>Please uncheck for those who did not attend</p>
                      <List bordered itemLayout="horizontal" size="small">
                        {gatheringData.attendees.map((attendee, i) => (
                          <ListItem key={attendee.userId + i}>
                            <List.Item.Meta
                              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                              title={attendee.userId}
                            />
                            <Checkbox checked={!attendee.didNotAttend} onChange={this.toggleAttendance.bind(this, attendee.userId)} />
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  : <p>Currently no one registered. Keep spreading the word!</p>
              : null
            }
          </Col>
    		</Row>
      </div>
    )
  }
}

export default Gathering;