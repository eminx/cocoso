import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  Flex,
  Link as CLink,
  Text,
} from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import Modal from '../components/Modal';
import NiceList from '../components/NiceList';

export default function GroupMembers({ group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');
  // const { currentUser } = useContext(StateContext);

  if (!group) {
    return null;
  }

  // const isMember =
  //   currentUser && group.members?.some((member) => member.memberId === currentUser._id);

  // const isAdmin =
  //   currentUser &&
  //   group.members?.some((member) => member.memberId === currentUser._id && member.isAdmin);

  const membersList =
    group &&
    group.members &&
    group.members.map((member) => ({
      ...member,
      actions: [
        {
          content: t('meeting.actions.makeAdmin'),
          handleClick: () =>
            this.setState({
              potentialNewAdmin: member.username,
            }),
          isDisabled: member.isAdmin,
        },
      ],
    }));

  return (
    <Box>
      <AvatarGroup
        _hover={{ bg: 'gray.200', borderRadius: '8px' }}
        cursor="pointer"
        max={6}
        p="2"
        size="lg"
        spacing="-1.5rem"
        onClick={() => setModalOpen(true)}
      >
        {group.members?.map((member) => (
          <Avatar key={member.memberId} name={member.username} showBorder src={member.avatar} />
        ))}
      </AvatarGroup>

      <Modal
        // actionButtonLabel={getButtonLabel()}
        isCentered
        isOpen={modalOpen}
        scrollBehavior="inside"
        // secondaryButtonLabel={copied ? tc('actions.copied') : tc('actions.share')}
        // size="xl"
        // onActionButtonClick={() => handleActionButtonClick()}
        onClose={() => setModalOpen(false)}
        // onSecondaryButtonClick={handleCopyLink}
      >
        <NiceList
          // actionsDisabled={!isAdmin}
          keySelector="username"
          list={membersList}
          py="4"
          spacing="4"
        >
          {(member) => (
            <Link to={`/@${member.username}/bio`}>
              <Flex align="center">
                <Avatar
                  borderRadius="8px"
                  mr="2"
                  name={member.username}
                  size="md"
                  src={member.avatar}
                />
                <CLink as="span" fontWeight={member.isAdmin ? 700 : 400}>
                  {member.username}
                </CLink>
                <Text ml="1">{member.isAdmin && '(admin)'}</Text>
              </Flex>
            </Link>
          )}
        </NiceList>
      </Modal>
    </Box>
  );
}
