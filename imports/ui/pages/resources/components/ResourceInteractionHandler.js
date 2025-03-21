import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

import { StateContext } from '../../../LayoutContainer';
import { ResourceContext } from '../Resource';
import { ChatButton } from '../../../chattery/ChatHandler';
import SlideWidget from '../../../entry/SlideWidget';
import ResourceAdminFunctions from './ResourceAdminFunctions';

function ReserveButton({ resource }) {
  const { currentHost, isDesktop } = useContext(StateContext);

  const isSameHost = resource.host === currentHost.host;

  let link = `/calendar?resourceId=${resource._id}&new=true`;

  if (!isSameHost) {
    link = `https://${resource.host}${link}`;
  }

  return (
    <Link to={link}>
      <Button
        as="span"
        borderColor="brand.200"
        borderWidth="2px"
        colorScheme="brand"
        height="48px"
        width={isDesktop ? '240px' : '180px'}
      >
        <Trans i18nKey="common:labels.book">Reserve</Trans>
      </Button>
    </Link>
  );
}

export default function ResourceInteractionHandler({ slideStart }) {
  const { canCreateContent, currentUser, role } = useContext(StateContext);
  const { resource } = useContext(ResourceContext);

  if (role === 'admin') {
    return (
      <SlideWidget justify="space-between" slideStart={slideStart}>
        <Box w="40px">
          <ResourceAdminFunctions />
        </Box>
        {resource.isBookable ? <ReserveButton resource={resource} /> : null}
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
        <ReserveButton resource={resource} />
        <Box>
          <ChatButton context="resources" currentUser={currentUser} item={resource} withInput />
        </Box>
      </SlideWidget>
    );
  }

  return null;
}
