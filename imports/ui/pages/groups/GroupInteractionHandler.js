import React from 'react';
import { Box, Slide } from '@chakra-ui/react';

import GroupMeetingDates from './components/GroupMeetingDates';
import GroupJoinButton from './components/GroupJoinButton';
import GroupLeaveButton from './components/GroupLeaveButton';

export default function GroupInteractionHandler({ currentUser, group, slideStart }) {
  const isMember =
    currentUser && group.members?.some((member) => member.memberId === currentUser._id);

  const isAdmin =
    isMember &&
    group.members?.some((member) => member.memberId === currentUser._id && member.isAdmin);

  const props = { currentUser, group, isAdmin, isMember };

  return (
    <>
      <Slide direction="bottom" in={slideStart} unmountOnExit style={{ zIndex: '10' }}>
        <Box bg="rgba(235, 255, 235, 0.9)" p="2" width="100%">
          {!isMember && <GroupJoinButton {...props} />}
          <GroupMeetingDates {...props} />
        </Box>
      </Slide>

      {isMember && <GroupLeaveButton {...props} />}
    </>
  );
}
