import React from 'react';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { currentUserAtom } from '/imports/state';
import { Box, Flex, Text } from '/imports/ui/core';
import SlideWidget from '/imports/ui/entry/SlideWidget';
import { ChatButton } from '/imports/ui/chattery/ChatHandler';

import GroupMeetingDates from './GroupMeetingDates';
import GroupJoinButton from './GroupJoinButton';
import GroupLeaveButton from './GroupLeaveButton';
import GroupAdminFunctions from './GroupAdminFunctions';
import { groupAtom } from '../GroupItemHandler';

export default function GroupInteractionHandler() {
  const currentUser = useAtomValue(currentUserAtom);
  const group = useAtomValue(groupAtom);

  if (!group) {
    return null;
  }

  const isMember =
    currentUser &&
    group.members?.some((member) => member.memberId === currentUser._id);

  const isAdmin =
    isMember &&
    group.members?.some(
      (member) => member.memberId === currentUser._id && member.isAdmin
    );

  const title = (
    <Flex align="center">
      <Trans i18nKey="common:labels.discussion" />
      <Text fontSize="sm" fontWeight="normal" ml="2" mt="1">
        <Trans i18nKey="common:labels.chat.onlymembers" />
      </Text>
    </Flex>
  );

  const memberProps = { currentUser, group, isAdmin, isMember };

  const notificationCount = currentUser?.notifications?.find(
    (n) => n?.contextId === group?._id
  )?.unSeenIndexes?.length;

  const chatProps = {
    context: 'groups',
    currentUser,
    item: group,
    notificationCount,
    title,
    withInput: true,
  };

  if (isAdmin) {
    return (
      <SlideWidget justify="space-between">
        <Box w="40px">
          <GroupAdminFunctions />
        </Box>
        <GroupMeetingDates {...memberProps} />
        <ChatButton {...chatProps} />
      </SlideWidget>
    );
  }

  if (isMember) {
    return (
      <>
        <Box p="4">
          <GroupLeaveButton />
        </Box>

        <SlideWidget justify="space-between">
          <Box w="40px" />
          <GroupMeetingDates {...memberProps} />
          <ChatButton {...chatProps} />
        </SlideWidget>
      </>
    );
  }

  return (
    <SlideWidget>
      <Box>
        <GroupJoinButton />
        <GroupMeetingDates {...memberProps} />
      </Box>
    </SlideWidget>
  );
}
