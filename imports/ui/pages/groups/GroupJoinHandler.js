import React, { useContext, useState } from 'react';
import { Box, Button, Center, Flex, Heading, Slide, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { DateJust } from '../../components/FancyDate';
import { useTranslation } from 'react-i18next';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import ConfirmModal from '../../components/ConfirmModal';

export default function GroupJoinHandler({ group, start }) {
  const [state, setState] = useState({
    leaveGroupModalOpen: false,
  });
  const [t] = useTranslation('groups');
  const { currentUser } = useContext(StateContext);

  if (!group) {
    return null;
  }

  const { leaveGroupModalOpen } = state;

  const leaveGroup = async () => {
    try {
      await call('leaveGroup', group._id);
      message.success(t('message.removed'));
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  const isMember =
    currentUser && group.members?.some((member) => member.memberId === currentUser._id);

  const isAdmin =
    isMember &&
    group.members?.some((member) => member.memberId === currentUser._id && member.isAdmin);

  return (
    <>
      <Slide direction="bottom" in={start} unmountOnExit>
        <Box bg="rgba(235, 255, 235, 0.9)" p="2" width="100%">
          {!isMember && <JoinButton currentUser={currentUser} group={group} />}
        </Box>
      </Slide>

      {isMember && (
        <Center>
          <Button
            colorScheme="red"
            onClick={() => setState({ ...state, leaveGroupModalOpen: true })}
          >
            {t('actions.leave')}
          </Button>
        </Center>
      )}

      {isMember && (
        <ConfirmModal
          visible={leaveGroupModalOpen}
          title={t('modal.leave.title')}
          onConfirm={leaveGroup}
          onCancel={() => setState({ ...state, leaveGroupModalOpen: false })}
          onClose={() => setState({ ...state, leaveGroupModalOpen: false })}
        >
          <Text>
            {t('modal.leave.body', {
              title: group?.title,
            })}
          </Text>
        </ConfirmModal>
      )}
    </>
  );
}

function JoinButton({ currentUser, group }) {
  const [state, setState] = useState({
    joinGroupModalOpen: false,
  });
  const [t] = useTranslation('groups');

  if (!group) {
    return null;
  }

  const joinGroup = async () => {
    if (!currentUser) {
      alert('Login first!');
    }

    try {
      await call('joinGroup', group._id);
      message.success(t('message.added'));
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  const { joinGroupModalOpen } = state;

  return (
    <>
      <Center>
        <Button
          borderColor="green.200"
          borderWidth="2px"
          colorScheme="green"
          height="48px"
          size="lg"
          width="240px"
          onClick={() => setState({ ...state, joinGroupModalOpen: true })}
        >
          {t('actions.join')}
        </Button>
      </Center>

      {group.meetings && (
        <Center color="gray.700" p="1">
          <Box>
            <Flex>
              <Text fontSize="sm" mr="2">
                Next meeting:{' '}
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {dayjs(group.meetings[0]?.startDate).format('DD')}{' '}
                {dayjs(group.meetings[0]?.startDate).format('MMM')}
              </Text>
            </Flex>
            <Center>
              <Button colorScheme="blue" fontSize="sm" variant="link">
                See all dates
              </Button>
            </Center>
          </Box>
        </Center>
      )}

      <ConfirmModal
        visible={joinGroupModalOpen}
        title={t('modal.join.title')}
        onConfirm={joinGroup}
        onCancel={() => setState({ ...state, joinGroupModalOpen: false })}
        onClose={() => setState({ ...state, joinGroupModalOpen: false })}
      >
        <Text>
          {t('modal.join.body', {
            title: group?.title,
          })}
        </Text>
      </ConfirmModal>
    </>
  );
}
