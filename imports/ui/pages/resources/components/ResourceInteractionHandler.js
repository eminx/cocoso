import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { ResourceContext } from '../Resource';
import { ChatButton } from '../../../chattery/ChatHandler';
import SlideWidget from '../../../entry/SlideWidget';
import ResourceAdminFunctions from './ResourceAdminFunctions';

export default function ResourceInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser, role } = useContext(StateContext);
  const { resource } = useContext(ResourceContext);

  if (role === 'admin') {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <Box w="40px">
          <ResourceAdminFunctions />
        </Box>
        <Box>
          <ChatButton context="resources" currentUser={currentUser} item={resource} withInput />
        </Box>
      </SlideWidget>
    );
  }

  if (canCreateContent) {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <Box w="40px" />
        <Box>
          <ChatButton context="resources" currentUser={currentUser} item={resource} withInput />
        </Box>
      </SlideWidget>
    );
  }

  return null;
}
