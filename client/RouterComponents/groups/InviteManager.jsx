import React from 'react';
import { Row, Col, Divider, Input, Button, Tag, message } from 'antd/lib';

import { emailIsValid, includesSpecialCharacters } from '../../functions';

const marginBottom = {
  marginBottom: 12
};

class InviteManager extends React.PureComponent {
  state = {
    emailInput: '',
    firstNameInput: ''
  };

  isAlreadyInvited = () => {
    const { emailInput } = this.state;
    const { group } = this.props;
    const peopleInvited = group.peopleInvited;
    const inviteEmailsList = peopleInvited.map(person => person.email);

    if (inviteEmailsList.indexOf(emailInput) !== -1) {
      message.error('This email address is already added');
      return true;
    }

    return false;
  };

  isValuesInvalid = () => {
    const { emailInput, firstNameInput } = this.state;

    if (!emailIsValid(emailInput)) {
      message.error('Please enter a valid email');
      return true;
    }

    if (
      firstNameInput.length < 2 ||
      includesSpecialCharacters(firstNameInput)
    ) {
      message.error('Please enter a valid first name');
      return true;
    }

    return;
  };

  handleSendInvite = event => {
    event.preventDefault();
    if (this.isAlreadyInvited() || this.isValuesInvalid()) {
      return;
    }

    const { emailInput, firstNameInput } = this.state;
    const { group } = this.props;

    const person = {
      firstName: firstNameInput,
      email: emailInput
    };

    Meteor.call(
      'invitePersonToPrivateGroup',
      group._id,
      person,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.destroy();
          message.error(error.reason);
        } else {
          message.success(
            `An email is sent and ${firstNameInput} is successfully invited to the group`
          );
          this.setState({
            firstNameInput: '',
            emailInput: ''
          });
        }
      }
    );
  };

  handleEmailInputChange = event => {
    event.preventDefault();
    this.setState({
      emailInput: event.target.value
    });
  };

  handleFirstNameInputChange = event => {
    event.preventDefault();
    this.setState({
      firstNameInput: event.target.value
    });
  };

  render() {
    const { emailInput, peopleToBeInvited, firstNameInput } = this.state;
    const { group } = this.props;
    const peopleInvited = group.peopleInvited;

    return (
      <React.Fragment>
        <Row>
          <Col xs={24} sm={24} md={16}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <p>
                Please add data for the person you want to invite to the group
              </p>
              <Input
                type="email"
                onChange={this.handleEmailInputChange}
                value={emailInput}
                placeholder="samuel@skogen.pm"
                addonBefore="email"
                style={{ maxWidth: 240, ...marginBottom }}
              />

              <Input
                onChange={this.handleFirstNameInputChange}
                value={firstNameInput}
                placeholder="Samuel"
                addonBefore="first name"
                style={{ maxWidth: 240, ...marginBottom }}
              />

              <Button
                style={{ maxWidth: 240, ...marginBottom }}
                onClick={this.handleSendInvite}
              >
                Send Invite
              </Button>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col xs={24} sm={24} md={16}>
            <EmailsContainer
              title="People Invited"
              count={peopleInvited.length}
            >
              {peopleInvited.map(person => (
                <Tag key={person.email} color="green" style={{ margin: 6 }}>
                  <b>{person.firstName}</b> | {person.email}
                </Tag>
              ))}
            </EmailsContainer>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const EmailsContainer = props => (
  <div
    style={{
      ...marginBottom,
      padding: 12,
      backgroundColor: '#eee'
    }}
  >
    <h4>
      {props.title} ({props.count})
    </h4>
    <div>{props.children}</div>
  </div>
);

export default InviteManager;
