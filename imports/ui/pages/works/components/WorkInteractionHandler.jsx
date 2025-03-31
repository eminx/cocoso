import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';

import { StateContext } from '../../../LayoutContainer';
import { WorkContext } from '../Work';
import SlideWidget from '../../../entry/SlideWidget';
import WorkAdminFunctions from './WorkAdminFunctions';
import ContactInfo from '../../profile/ContactInfo';

export default function WorkInteractionHandler({ slideStart }) {
  const { currentUser } = useContext(StateContext);
  const { work } = useContext(WorkContext);

  if (!work) {
    return null;
  }

  if (!currentUser || currentUser._id !== work.authorId) {
    return (
      <SlideWidget justify="center" slideStart={slideStart}>
        <ContactInfo username={work.authorUsername} />
      </SlideWidget>
    );
  }

  return (
    <SlideWidget justify="space-between" slideStart={slideStart}>
      <Box w="40px">
        <WorkAdminFunctions />
      </Box>
      <ContactInfo username={work.authorUsername} />
      <Box w="40px" />
    </SlideWidget>
  );
}
