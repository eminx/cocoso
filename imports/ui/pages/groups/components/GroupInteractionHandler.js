import React from 'react';
import { Box, Flex, Slide } from '@chakra-ui/react';

import GroupMeetingDates from './GroupMeetingDates';
import GroupJoinButton from './GroupJoinButton';
import GroupLeaveButton from './GroupLeaveButton';
import GroupAdminFunctions from './GroupAdminFunctions';

export default function GroupInteractionHandler({ currentUser, group, slideStart }) {
  const isMember =
    currentUser && group.members?.some((member) => member.memberId === currentUser._id);

  const isAdmin =
    isMember &&
    group.members?.some((member) => member.memberId === currentUser._id && member.isAdmin);

  const props = { currentUser, group, isAdmin, isMember };

  return (
    <>
      {isMember && !isAdmin && <GroupLeaveButton {...props} />}

      <Slide direction="bottom" in={slideStart} unmountOnExit>
        <Flex bg="green.50" justify="space-between" p="2" width="100%">
          {isAdmin && <Box />}
          {!isMember && <GroupJoinButton {...props} />}
          <GroupMeetingDates {...props} />
          {isAdmin && <GroupAdminFunctions {...props} />}
        </Flex>
      </Slide>
    </>
  );
}
