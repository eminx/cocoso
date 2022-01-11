import React, { PureComponent } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';

import FormField from '../../components/FormField';
import { emailIsValid, includesSpecialCharacters } from '../../@/shared';
import { message } from '../../components/message';

class InviteManager extends PureComponent {
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
      <Box>
        <VStack py="6">
          <Text>
            Please add data for the person you want to invite to the process
          </Text>
          <FormField label="email">
            <Input
              onChange={this.handleEmailInputChange}
              placeholder="samuel@skogen.pm"
              value={emailInput}
            />
          </FormField>

          <FormField label="first name">
            <Input
              onChange={this.handleFirstNameInputChange}
              placeholder="Samuel"
              value={firstNameInput}
            />
          </FormField>

          <Button onClick={this.handleSendInvite}>Send Invite</Button>
        </VStack>

        <Box py="6">
          <EmailsContainer title="People Invited" count={peopleInvited.length}>
            {peopleInvited.map((person) => (
              <Tag key={person.email}>
                <Text fontWeight="bold" mr="1">
                  {person.firstName}
                </Text>
                {person.email}
              </Tag>
            ))}
          </EmailsContainer>
        </Box>
      </Box>
    );
  }
}

const EmailsContainer = (props) => (
  <Box>
    <Heading size="md" mb="4">
      {props.title} ({props.count})
    </Heading>
    <Box>{props.children}</Box>
  </Box>
);

export default InviteManager;
