import React, { useContext } from 'react';
import { Box, Flex, Slide } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { ActivityContext } from '../Activity';
import RsvpHandler from './RsvpHandler';
import { ChatButton } from '../../../chattery/ChatHandler';

export default function ActivityInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser } = useContext(StateContext);
  const { activity } = useContext(ActivityContext);

  return (
    <>
      <Slide direction="bottom" in={slideStart} unmountOnExit style={{ zIndex: 10 }}>
        <Flex bg="rgba(235, 255, 235, 0.95)" justify="space-between" p="4" width="100%">
          {currentUser && canCreateContent && <Box w="40px" />}
          <RsvpHandler activity={activity} />
          {currentUser && canCreateContent && (
            <Box>
              <ChatButton
                context="activities"
                currentUser={currentUser}
                item={activity}
                withInput
              />
            </Box>
          )}
        </Flex>
      </Slide>
    </>
  );
}
