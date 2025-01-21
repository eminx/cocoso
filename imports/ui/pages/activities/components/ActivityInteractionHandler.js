import React, { useContext } from 'react';
import { Box, Flex, Slide } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { ActivityContext } from '../Activity';
import RsvpHandler from './RsvpHandler';
import { ChatButton } from '../../../chattery/ChatHandler';

export default function ActivityInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser } = useContext(StateContext);
  const { activity } = useContext(ActivityContext);

  const isVerifiedUser = currentUser && canCreateContent;

  if (isVerifiedUser) {
    return (
      <Slide direction="bottom" in={slideStart} unmountOnExit style={{ zIndex: 10 }}>
        <Flex bg="green.50" justify="space-between" p="4" width="100%">
          <Box w="40px" />
          <RsvpHandler activity={activity} />
          <Box>
            <ChatButton context="activities" currentUser={currentUser} item={activity} withInput />
          </Box>
        </Flex>
      </Slide>
    );
  }

  return (
    <Slide direction="bottom" in={slideStart} unmountOnExit style={{ zIndex: 10 }}>
      <Flex bg="green.50" justify="center" p="4" width="100%">
        <RsvpHandler activity={activity} />
      </Flex>
    </Slide>
  );
}
