import React, { useContext } from 'react';
import { Trans } from 'react-i18next';

import { Box, Flex, Text } from '/imports/ui/core';

import { StateContext } from '/imports/ui/LayoutContainer';
import SlideWidget from '/imports/ui/entry/SlideWidget';
import { ChatButton } from '/imports/ui/chattery/ChatHandler';

import { ActivityContext } from '../Activity';
import ActivityAdminFunctions from './ActivityAdminFunctions';
import RsvpHandler from './RsvpHandler';

export default function ActivityInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser, role } = useContext(StateContext);
  const activityContext = useContext(ActivityContext);
  const activity = activityContext?.activity;

  if (!activity) {
    return null;
  }

  const { isPublicActivity } = activity;

  const title = (
    <Flex align="center">
      <Trans i18nKey="common:labels.discussion" />
      <Text fontSize="sm" fontWeight="normal" ml="2" mt="1">
        <Trans i18nKey="common:labels.chat.onlyverified" />
      </Text>
    </Flex>
  );

  const chatProps = {
    context: 'activities',
    currentUser,
    item: activity,
    title,
    withInput: true,
  };

  if (
    currentUser &&
    (role === 'admin' || activity.authorId === currentUser._id)
  ) {
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
