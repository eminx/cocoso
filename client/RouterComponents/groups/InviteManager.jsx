import React from 'react';
import { Row, Col, Divider, Input, Button, Tag, message } from 'antd/lib';

import { emailIsValid } from '../../functions';

const marginBottom = {
  marginBottom: 12
};

class InviteManager extends React.PureComponent {
  state = {
    peopleToBeInvited: [],
    emailInput: '',
    firstNameInput: ''
  };

  handleAddInviteEmail = event => {
    event.preventDefault();
    const { peopleToBeInvited, emailInput, firstNameInput } = this.state;
    const { peopleInvited } = this.props;

    if (!emailIsValid(emailInput)) {
      message.error('Please enter a valid email');
      return;
    }

    if (firstNameInput.length < 2) {
      message.error('Please enter a valid first name');
      return;
    }

    const inviteEmailsList = peopleToBeInvited.map(person => person.email);

    if (inviteEmailsList.indexOf(emailInput) !== -1) {
      message.error('This email address is already added to the list');
      return;
    } else if (peopleInvited.indexOf(emailInput) !== -1) {
      message.error('This person is already invited');
      return;
    }

    this.setState({
      peopleToBeInvited: [
        ...peopleToBeInvited,
        {
          email: emailInput,
          firstName: firstNameInput
        }
      ],
      emailInput: '',
      firstNameInput: ''
    });
  };

  handleRemoveInviteEmail = (event, email) => {
    event.preventDefault();
    const { peopleToBeInvited } = this.state;
    const filteredPeople = peopleToBeInvited.filter(
      person => person.email !== email
    );
    this.setState({ peopleToBeInvited: filteredPeople });
  };

  handleSendInvites = () => {
    const { peopleToBeInvited } = this.state;
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
    const { peopleInvited } = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col xs={24} sm={24} md={16}>
            <div
              style={{
                marginBottom: 24,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <p>
                Please add data for each person you'd like to invite and add to
                the list.
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
                onClick={this.handleAddInviteEmail}
              >
                Add
              </Button>
            </div>
            <EmailsContainer
              title="People to be Invited"
              count={peopleToBeInvited.length}
            >
              {peopleToBeInvited.map(person => (
                <Tag
                  key={person.email}
                  closable
                  onClose={event =>
                    this.handleRemoveInviteEmail(event, person.email)
                  }
                >
                  <b>{person.firstName}</b> | {person.email}
                </Tag>
              ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 12
                }}
              >
                <Button
                  disabled={peopleToBeInvited.length === 0}
                  onClick={this.handleSendInvites}
                >
                  Send Invites
                </Button>
              </div>
            </EmailsContainer>
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
                <Tag key={person.email} color="green">
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
