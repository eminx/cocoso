import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { ActivityContext } from '../Activity';
import RsvpHandler from './RsvpHandler';
import { ChatButton } from '../../../chattery/ChatHandler';
import SlideWidget from '../../../entry/SlideWidget';

export default function ActivityInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser } = useContext(StateContext);
  const { activity } = useContext(ActivityContext);

  const isVerifiedUser = currentUser && canCreateContent;

  if (isVerifiedUser) {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <Box w="40px" />
        <RsvpHandler activity={activity} />
        <Box>
          <ChatButton context="activities" currentUser={currentUser} item={activity} withInput />
        </Box>
      </SlideWidget>
    );
  }

  return (
    <SlideWidget slideStart={slideStart}>
      <RsvpHandler activity={activity} />
    </SlideWidget>
  );
}
