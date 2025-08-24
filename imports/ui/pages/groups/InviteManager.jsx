import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import XIcon from 'lucide-react/dist/esm/icons/x';

import {
  Box,
  Button,
  Drawer,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Text,
  VStack,
} from '/imports/ui/core';

import FormField from '/imports/ui/forms/FormField';
import {
  call,
  emailIsValid,
  includesSpecialCharacters,
} from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

import { GroupContext } from './Group';

const EmailsContainer = (props) => (
  <Box>
    <Heading size="md" mb="4">
      {props.title} ({props.count})
    </Heading>
    <HStack wrap="wrap">{props.children}</HStack>
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
    if (
      firstNameInput.length < 2 ||
      includesSpecialCharacters(firstNameInput)
    ) {
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
      open={isOpen}
      title={t('actions.invite')}
      onClose={() => setSearchParams({ invite: 'false' })}
    >
      <Box>
        <VStack py="2" gap="2">
          <Text mb="2">{t('invite.info')}</Text>

          <FormField label={t('invite.email.label')} required>
            <Input
              onChange={handleEmailInputChange}
              placeholder={t('invite.email.holder')}
              value={state.emailInput}
            />
          </FormField>

          <FormField label={t('invite.firstName.label')} required>
            <Input
              onChange={handleFirstNameInputChange}
              placeholder={t('invite.firstName.holder')}
              value={state.firstNameInput}
            />
          </FormField>
          <FormField>
            <Flex justify="flex-end">
              <Button onClick={handleSendInvite}>{t('invite.submit')}</Button>
            </Flex>
          </FormField>
        </VStack>

        <Box py="8">
          <EmailsContainer title="People Invited" count={peopleInvited?.length}>
            {peopleInvited?.map((person) => (
              <Flex
                key={person.email}
                align="center"
                bg="green.50"
                gap="0"
                pl="2"
                css={{
                  border: '1px solid',
                  borderColor: 'var(--cocoso-colors-green-400)',
                  borderRadius: 'var(--cocoso-border-radius)',
                }}
              >
                <Box px="1">{`${person?.firstName} <${person?.email}>`}</Box>
                <IconButton
                  color="var(--cocoso-colors-red-300)"
                  icon={<XIcon size={12} />}
                  variant="ghost"
                  size="xs"
                  onClick={() => handleRemoveInvite(person)}
                />
              </Flex>
            ))}
          </EmailsContainer>
        </Box>
      </Box>
    </Drawer>
  );
}
