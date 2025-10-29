import React from 'react';
import { useAtomValue } from 'jotai';

import SlideWidget from '/imports/ui/entry/SlideWidget';
import { Box } from '/imports/ui/core';
import { currentUserAtom, roleAtom } from '/imports/state';

import PageAdminFunctions from './PageAdminFunctions';

export default function PageInteractionHandler() {
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);

  if (!currentUser || role !== 'admin') {
    return null;
  }
  return (
    <SlideWidget justify="space-between">
      <Box w="40px">
        <PageAdminFunctions />
      </Box>
      <Box w="40px" />
    </SlideWidget>
  );
}
