import React from 'react';
import { Box, Heading, FormField, TextInput, Paragraph, Button } from 'grommet';
import { Tag } from '@chakra-ui/react';

import { emailIsValid, includesSpecialCharacters } from '../../functions';
import { message, SimpleTag } from '../../UIComponents/message';

class InviteManager extends React.PureComponent {
  state = {
    emailInput: '',
    firstNameInput: '',
  };

  isAlreadyInvited = () => {
    const { emailInput } = this.state;
    const { process } = this.props;
    const peopleInvited = process.peopleInvited;
    const inviteEmailsList = peopleInvited.map((person) => person.email);

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

  handleSendInvite = (event) => {
    event.preventDefault();
    if (this.isAlreadyInvited() || this.isValuesInvalid()) {
      return;
    }

    const { emailInput, firstNameInput } = this.state;
    const { process } = this.props;

    const person = {
      firstName: firstNameInput,
      email: emailInput,
    };

    Meteor.call(
      'invitePersonToPrivateProcess',
      process._id,
      person,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.destroy();
          message.error(error.reason);
        } else {
          message.success(
            `An email is sent and ${firstNameInput} is successfully invited to the process`
          );
          this.setState({
            firstNameInput: '',
            emailInput: '',
          });
        }
      }
    );
  };

  handleEmailInputChange = (event) => {
    event.preventDefault();
    this.setState({
      emailInput: event.target.value,
    });
  };

  handleFirstNameInputChange = (event) => {
    event.preventDefault();
    this.setState({
      firstNameInput: event.target.value,
    });
  };

  render() {
    const { emailInput, peopleToBeInvited, firstNameInput } = this.state;
    const { process } = this.props;
    const peopleInvited = process.peopleInvited;

    return (
      <React.Fragment>
        <Box pad={{ top: 'medium', bottom: 'medium' }}>
          <Paragraph>
            Please add data for the person you want to invite to the process
          </Paragraph>
          <FormField label="email">
            <TextInput
              plain={false}
              onChange={this.handleEmailInputChange}
              value={emailInput}
              placeholder="samuel@skogen.pm"
            />
          </FormField>

          <FormField label="first name">
            <TextInput
              plain={false}
              onChange={this.handleFirstNameInputChange}
              value={firstNameInput}
              placeholder="Samuel"
            />
          </FormField>

          <Button
            margin={{ top: 'small' }}
            label="Send Invite"
            onClick={this.handleSendInvite}
          />
        </Box>

        <Box pad={{ top: 'medium', bottom: 'medium' }}>
          <EmailsContainer title="People Invited" count={peopleInvited.length}>
            {peopleInvited.map((person) => (
              <Tag key={person.email}>
                <b>{person.firstName}</b> | {person.email}
              </Tag>
            ))}
          </EmailsContainer>
        </Box>
      </React.Fragment>
    );
  }
}

const EmailsContainer = (props) => (
  <Box pad="small" background="light-1" round="4px">
    <Heading level={4}>
      {props.title} ({props.count})
    </Heading>
    <Box>{props.children}</Box>
  </Box>
);

export default InviteManager;
