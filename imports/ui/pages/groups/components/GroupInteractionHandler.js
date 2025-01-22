import React from 'react';
import { Box, Flex, Slide } from '@chakra-ui/react';

import GroupMeetingDates from './GroupMeetingDates';
import GroupJoinButton from './GroupJoinButton';
import GroupLeaveButton from './GroupLeaveButton';
import GroupAdminFunctions from './GroupAdminFunctions';

export default function GroupInteractionHandler({ currentUser, group, slideStart }) {
  if (!group) {
    return null;
  }

  const isMember =
    currentUser && group.members?.some((member) => member.memberId === currentUser._id);

  const isAdmin =
    isMember &&
    group.members?.some((member) => member.memberId === currentUser._id && member.isAdmin);

  const props = { currentUser, group, isAdmin, isMember };

  if (isAdmin) {
    return (
      <Slide direction="bottom" in={slideStart} unmountOnExit>
        <Flex bg="gray.800" justify="space-between" p="4" width="100%">
          <Box />
          <GroupMeetingDates {...props} />
          <GroupAdminFunctions />
        </Flex>
      </Slide>
    );
  }

  if (isMember) {
    return (
      <>
        <GroupLeaveButton {...props} />

        <Slide direction="bottom" in={slideStart} unmountOnExit>
          <Flex bg="gray.800" justify="center" p="4" width="100%">
            <GroupMeetingDates {...props} />
          </Flex>
        </Slide>
      </>
    );
  }

  return (
    <Slide direction="bottom" in={slideStart} unmountOnExit>
      <Flex bg="gray.800" justify="center" p="4" width="100%">
        <Box>
          <GroupJoinButton />
          <GroupMeetingDates {...props} />
        </Box>
      </Flex>
    </Slide>
  );
}
