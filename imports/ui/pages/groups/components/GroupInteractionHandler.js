import React from 'react';
import { Box } from '@chakra-ui/react';

import GroupMeetingDates from './GroupMeetingDates';
import GroupJoinButton from './GroupJoinButton';
import GroupLeaveButton from './GroupLeaveButton';
import GroupAdminFunctions from './GroupAdminFunctions';
import SlideWidget from '../../../entry/SlideWidget';

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
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <Box />
        <GroupMeetingDates {...props} />
        <GroupAdminFunctions />
      </SlideWidget>
    );
  }

  if (isMember) {
    return (
      <>
        <GroupLeaveButton {...props} />

        <SlideWidget slideStart={slideStart}>
          <GroupMeetingDates {...props} />
        </SlideWidget>
      </>
    );
  }

  return (
    <SlideWidget slideStart={slideStart}>
      <Box>
        <GroupJoinButton />
        <GroupMeetingDates {...props} />
      </Box>
    </SlideWidget>
  );
}
