import React, { useContext } from 'react';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';

// import // canCreateContentAtom,
// currentUserAtom,
// roleAtom,
// '/imports/state';
import { Box, Flex, Text } from '/imports/ui/core';
import SlideWidget from '/imports/ui/entry/SlideWidget';
import { ChatButton } from '/imports/ui/chattery/ChatHandler';

import RsvpHandler from './RsvpHandler';

export default function ActivityInteractionHandler({ activity }) {
  // const canCreateContent = useAtomValue(canCreateContentAtom);
  // const currentUser = useAtomValue(currentUserAtom);
  // const role = useAtomValue(roleAtom);
  const canCreateContent = false;
  const currentUser = null;
  const role = null;

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
      <SlideWidget justify="space-between">
        {/* <ActivityAdminFunctions /> */}
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
      <SlideWidget justify="space-between">
        <Box />
        <RsvpHandler activity={activity} />
        <ChatButton {...chatProps} />
      </SlideWidget>
    );
  }

  if (activity.isPublicActivity) {
    return (
      <SlideWidget>
        <RsvpHandler activity={activity} />
      </SlideWidget>
    );
  }

  return null;
}
