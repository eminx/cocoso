import React, { useContext } from 'react';
import { Box, Flex, Slide } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { ResourceContext } from '../Resource';
import { ChatButton } from '../../../chattery/ChatHandler';

export default function ResourceInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser } = useContext(StateContext);
  const { resource } = useContext(ResourceContext);

  return (
    <>
      <Slide direction="bottom" in={slideStart} unmountOnExit style={{ zIndex: 10 }}>
        <Flex bg="green.50" justify="space-between" p="4" width="100%">
          {currentUser && canCreateContent && <Box w="40px" />}
          <Box />
          {currentUser && canCreateContent && (
            <Box>
              <ChatButton context="resources" currentUser={currentUser} item={resource} withInput />
            </Box>
          )}
        </Flex>
      </Slide>
    </>
  );
}
