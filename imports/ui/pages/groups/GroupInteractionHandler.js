import React from 'react';
import { Box, Flex, Slide } from '@chakra-ui/react';

import GroupMeetingDates from './components/GroupMeetingDates';
import GroupJoinButton from './components/GroupJoinButton';
import GroupLeaveButton from './components/GroupLeaveButton';
import GroupAdminFunctions from './components/GroupAdminFunctions';

export default function GroupInteractionHandler({ currentUser, group, slideStart }) {
  const isMember =
    currentUser && group.members?.some((member) => member.memberId === currentUser._id);

  const isAdmin =
    isMember &&
    group.members?.some((member) => member.memberId === currentUser._id && member.isAdmin);

  const props = { currentUser, group, isAdmin, isMember };

  const slideStartDelayed = setTimeout(() => slideStart, 500);

  return (
    <>
      {isMember && !isAdmin && <GroupLeaveButton {...props} />}

      <Slide direction="bottom" in={slideStart} unmountOnExit>
        <Box bg="rgba(235, 255, 235, 0.9)" p="2" width="100%">
          {!isMember && <GroupJoinButton {...props} />}
          <GroupMeetingDates {...props} />
          {isAdmin && <GroupAdminFunctions {...props} />}
        </Box>
      </Slide>
    </>
  );
}
