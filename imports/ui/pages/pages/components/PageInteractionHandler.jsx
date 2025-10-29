import React from 'react';
import { useAtomValue } from 'jotai';

import { Box } from '/imports/ui/core';
import { currentUserAtom, roleAtom } from '../../../../state';
import SlideWidget from '../../../entry/SlideWidget';
import PageAdminFunctions from './PageAdminFunctions';

export default function PageInteractionHandler({ slideStart }) {
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);

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
