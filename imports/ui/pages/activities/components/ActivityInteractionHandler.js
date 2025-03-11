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
  const activityContext = useContext(ActivityContext);
  const activity = activityContext?.activity;

  if (!activity) {
    return null;
  }

  const { isPublicActivity } = activity;

  const chatProps = {
    context: 'activities',
    currentUser,
    item: activity,
    withInput: true,
  };

  if (currentUser && (role === 'admin' || activity.authorId === currentUser._id)) {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <ActivityAdminFunctions />
        {isPublicActivity ? (
          <>
            <RsvpHandler activity={activity} />
            <ChatButton {...chatProps} />
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
        <ChatButton {...chatProps} />
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
