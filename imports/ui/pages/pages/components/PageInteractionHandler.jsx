import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import SlideWidget from '../../../entry/SlideWidget';
import PageAdminFunctions from './PageAdminFunctions';

export default function PageInteractionHandler({ slideStart }) {
  const { currentUser, role } = useContext(StateContext);

  if (!currentUser || role !== 'admin') {
    return null;
  }
  return (
    <SlideWidget justify="space-between" slideStart={slideStart}>
      <Box w="40px">
        <PageAdminFunctions />
      </Box>
      <Box w="40px" />
    </SlideWidget>
  );
}
