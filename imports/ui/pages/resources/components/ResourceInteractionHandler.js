import React from 'react';
import { Link } from 'react-router';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { Box, Button } from '/imports/ui/core';
import {
  canCreateContentAtom,
  currentHostAtom,
  currentUserAtom,
  isDesktopAtom,
  roleAtom,
} from '/imports/state';
import { ChatButton } from '/imports/ui/chattery/ChatHandler';
import SlideWidget from '/imports/ui/entry/SlideWidget';

import ResourceAdminFunctions from './ResourceAdminFunctions';

function ReserveButton({ resource }) {
  const currentHost = useAtomValue(currentHostAtom);
  const isDesktop = useAtomValue(isDesktopAtom);

  const isSameHost = resource.host === currentHost.host;

  let link = `/calendar?resourceId=${resource._id}&new=true`;

  if (!isSameHost) {
    link = `https://${resource.host}${link}`;
  }

  return (
    <Box>
      <Link to={link}>
        <Button size={isDesktop ? 'lg' : 'md'}>
          <Trans i18nKey="common:labels.book">Reserve</Trans>
        </Button>
      </Link>
    </Box>
  );
}

export default function ResourceInteractionHandler({ resource }) {
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);

  if (role === 'admin') {
    return (
      <SlideWidget justify="space-between">
        <Box w="40px">
          <ResourceAdminFunctions />
        </Box>
        {resource.isBookable ? <ReserveButton resource={resource} /> : null}
        <Box>
          <ChatButton
            context="resources"
            currentUser={currentUser}
            item={resource}
            withInput
          />
        </Box>
      </SlideWidget>
    );
  }

  if (canCreateContent) {
    return (
      <SlideWidget justify="space-between">
        <Box w="40px" />
        {resource.isBookable ? <ReserveButton resource={resource} /> : null}
        <Box>
          <ChatButton
            context="resources"
            currentUser={currentUser}
            item={resource}
            withInput
          />
        </Box>
      </SlideWidget>
    );
  }

  return null;
}
