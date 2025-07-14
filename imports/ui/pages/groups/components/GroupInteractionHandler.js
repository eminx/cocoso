import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

import GroupMeetingDates from './GroupMeetingDates';
import GroupJoinButton from './GroupJoinButton';
import GroupLeaveButton from './GroupLeaveButton';
import GroupAdminFunctions from './GroupAdminFunctions';
import SlideWidget from '../../../entry/SlideWidget';
import { ChatButton } from '../../../chattery/ChatHandler';

export default function GroupInteractionHandler({
  currentUser,
  group,
  slideStart,
}) {
  if (!group) {
    return null;
  }

  const isMember =
    currentUser &&
    group.members?.some(
      (member) => member.memberId === currentUser._id
    );

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

  console.log('currentUser', currentUser);
  console.log(
    'notificationCount groupNotes',
    notificationCount?.length
  );

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
      <SlideWidget justify="space-between" slideStart={slideStart}>
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
        <GroupLeaveButton />

        <SlideWidget justify="space-between" slideStart={slideStart}>
          <Box w="40px" />
          <GroupMeetingDates {...memberProps} />
          <ChatButton {...chatProps} />
        </SlideWidget>
      </>
    );
  }

  return (
    <SlideWidget slideStart={slideStart}>
      <Box>
        <GroupJoinButton />
        <GroupMeetingDates {...memberProps} />
      </Box>
    </SlideWidget>
  );
}
