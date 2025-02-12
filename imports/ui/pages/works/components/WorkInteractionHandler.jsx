import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { WorkContext } from '../Work';
import SlideWidget from '../../../entry/SlideWidget';
import WorkAdminFunctions from './WorkAdminFunctions';

export default function WorkInteractionHandler({ slideStart }) {
  const { currentUser } = useContext(StateContext);
  const { work } = useContext(WorkContext);

  if (currentUser && currentUser._id === work?.authorId) {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <Box w="40px">
          <WorkAdminFunctions />
        </Box>
        <Box w="40px" />
      </SlideWidget>
    );
  }

  return null;
}
