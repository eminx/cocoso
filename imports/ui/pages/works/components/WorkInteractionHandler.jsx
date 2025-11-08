import React from 'react';
import { useAtomValue } from 'jotai';

import { Box } from '/imports/ui/core';
import { currentUserAtom } from '/imports/state';
import SlideWidget from '/imports/ui/entry/SlideWidget';

import WorkAdminFunctions from './WorkAdminFunctions';
import ContactInfo from '../../profile/ContactInfo';
import { workAtom } from '../WorkItemHandler';

export default function WorkInteractionHandler() {
  const currentUser = useAtomValue(currentUserAtom);
  const work = useAtomValue(workAtom);

  if (!work) {
    return null;
  }

  if (!currentUser || currentUser._id !== work.authorId) {
    return (
      <SlideWidget justify="center">
        <ContactInfo username={work.authorUsername} />
      </SlideWidget>
    );
  }

  return (
    <SlideWidget justify="space-between">
      <Box w="40px">
        <WorkAdminFunctions />
      </Box>
      <ContactInfo username={work.authorUsername} />
      <Box w="40px" />
    </SlideWidget>
  );
}
