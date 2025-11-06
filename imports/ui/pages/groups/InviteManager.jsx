import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import XIcon from 'lucide-react/dist/esm/icons/x';
import { useAtom, useAtomValue } from 'jotai';

import {
  Box,
  Button,
  Drawer,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
} from '/imports/ui/core';

import FormField from '/imports/ui/forms/FormField';
import {
  call,
  emailIsValid,
  includesSpecialCharacters,
} from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

import { groupAtom } from './GroupItemHandler';

const EmailsContainer = (props) => (
  <Box>
    <Heading size="md" mb="4">
      {props.title} ({props.count})
    </Heading>
    <Flex wrap="wrap">{props.children}</Flex>
  </Box>
);

export default function InviteManager() {
  const [state, setState] = useState({
    emailInput: '',
    firstNameInput: '',
  });
  const [group, setGroup] = useAtom(groupAtom);
  const [t] = useTranslation('groups');
  const [searchParams, setSearchParams] = useSearchParams();

  const peopleInvited = group?.peopleInvited;

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
      const groupId = group?._id;
      await call('invitePersonToPrivateGroup', groupId, person);
      setGroup(await call('getGroupById', groupId));
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
      const groupId = group?._id;
      await call('removePersonFromInvitedList', groupId, person);
      setGroup(await call('getGroupById', groupId));
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
        <Flex direction="column" gap="2" py="2">
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
        </Flex>

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
