import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import FormField from '../../forms/FormField';
import { call, emailIsValid, includesSpecialCharacters } from '../../utils/shared';
import { message } from '../../generic/message';
import Drawer from '../../generic/Drawer';
import { GroupContext } from './Group';

const EmailsContainer = (props) => (
  <Box>
    <Heading size="md" mb="4">
      {props.title} ({props.count})
    </Heading>
    <Box>{props.children}</Box>
  </Box>
);

export default function InviteManager() {
  const [state, setState] = useState({
    emailInput: '',
    firstNameInput: '',
  });
  const { group, getGroupById } = useContext(GroupContext);
  const [t] = useTranslation('groups');
  const [searchParams, setSearchParams] = useSearchParams();

  const peopleInvited = group.peopleInvited;

  const isAlreadyInvited = () => {
    const inviteEmailsList = peopleInvited.map((person) => person.email);
    const emailInput = state.emailInput;
    if (inviteEmailsList.indexOf(emailInput) !== -1) {
      message.error(t('invite.email.already'));
      return true;
    }
    return false;
  };

  const isValuesInvalid = () => {
    const emailInput = state.emailInput;
    if (!emailIsValid(emailInput)) {
      message.error(t('invite.email.valid'));
      return true;
    }

    const firstNameInput = state.firstNameInput;
    if (firstNameInput.length < 2 || includesSpecialCharacters(firstNameInput)) {
      message.error(t('invite.firstName.valid'));
      return true;
    }
    return false;
  };

  const handleSendInvite = async (event) => {
    event.preventDefault();
    if (isAlreadyInvited() || isValuesInvalid()) {
      return;
    }

    const person = {
      firstName: state.firstNameInput,
      email: state.emailInput,
    };

    try {
      await call('invitePersonToPrivateGroup', group._id, person);
      await getGroupById();
      message.success(t('invite.success', { name: state.firstNameInput }));
      setState((prevState) => ({
        ...prevState,
        firstNameInput: '',
        emailInput: '',
      }));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleRemoveInvite = async (person) => {
    try {
      await call('removePersonFromInvitedList', group._id, person);
      await getGroupById();
      message.success(t('invite.remove.success'));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleEmailInputChange = (event) => {
    event.preventDefault();
    setState((prevState) => ({
      ...prevState,
      emailInput: event.target.value,
    }));
  };

  const handleFirstNameInputChange = (event) => {
    event.preventDefault();
    setState((prevState) => ({
      ...prevState,
      firstNameInput: event.target.value,
    }));
  };

  const isOpen = searchParams.get('invite') === 'true';

  return (
    <Drawer
      isOpen={isOpen}
      title={t('actions.invite')}
      onClose={() => setSearchParams({ invite: 'false' })}
    >
      <Box>
        <VStack py="6">
          <Text>{t('invite.info')}</Text>
          <FormField label={t('invite.email.label')}>
            <Input
              onChange={handleEmailInputChange}
              placeholder={t('invite.email.holder')}
              value={state.emailInput}
            />
          </FormField>

          <FormField label={t('invite.firstName.label')}>
            <Input
              onChange={handleFirstNameInputChange}
              placeholder={t('invite.firstName.holder')}
              value={state.firstNameInput}
            />
          </FormField>
          <FormField>
            <Flex justifyContent="flex-end">
              <Button onClick={handleSendInvite}>{t('invite.submit')}</Button>
            </Flex>
          </FormField>
        </VStack>

        <Box py="8">
          <EmailsContainer title="People Invited" count={peopleInvited?.length}>
            {peopleInvited?.map((person) => (
              <Tag
                key={person.email}
                borderRadius="full"
                colorScheme="green"
                mb="2"
                mr="2"
                px="4"
                py="2"
                variant="solid"
              >
                <TagLabel fontWeight="bold" mr="2">
                  {person?.firstName}
                </TagLabel>
                <Text>{person?.email}</Text>
                <TagCloseButton onClick={() => handleRemoveInvite(person)} />
              </Tag>
            ))}
          </EmailsContainer>
        </Box>
      </Box>
    </Drawer>
  );
}
