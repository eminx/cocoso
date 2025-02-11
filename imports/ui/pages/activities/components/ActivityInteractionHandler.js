import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { ActivityContext } from '../Activity';
import RsvpHandler from './RsvpHandler';
import SlideWidget from '../../../entry/SlideWidget';
import ActivityAdminFunctions from './ActivityAdminFunctions';
import { ChatButton } from '../../../chattery/ChatHandler';

export default function ActivityInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser, role } = useContext(StateContext);
  const { activity } = useContext(ActivityContext);

  if (!activity) {
    return null;
  }

  const { isPublicActivity } = activity;

  if (currentUser && (role === 'admin' || activity.authorId === currentUser._id)) {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <ActivityAdminFunctions />
        {isPublicActivity ? (
          <>
            <RsvpHandler activity={activity} />
            <ChatButton context="activities" currentUser={currentUser} item={activity} withInput />
          </>
        ) : (
          <Box />
        )}
      </SlideWidget>
    );
  }

  if (currentUser && canCreateContent && isPublicActivity) {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <Box />
        <RsvpHandler activity={activity} />
        <ChatButton context="activities" currentUser={currentUser} item={activity} withInput />
      </SlideWidget>
    );
  }

  if (activity.isPublicActivity) {
    return (
      <SlideWidget slideStart={slideStart}>
        <RsvpHandler activity={activity} />
      </SlideWidget>
    );
  }

  return null;
}
