import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Trans } from 'react-i18next';

import { Center } from '/imports/ui/core';
import { Host } from '/imports/ui/types';

import ListingGenericHybrid from './ListingGenericHybrid';
import { getRenderPass } from './helpers';
import InfiniteScroller from './InfiniteScroller';
import SexyThumb from './SexyThumb';
import Tabs from '../core/Tabs';

export interface ActivitiesHybridProps {
  Host: Host;
  activities: any[];
  showPast?: boolean;
}

const LISTING = 'activities';

export default function ActivitiesHybrid({
  Host,
  activities,
  showPast,
}: ActivitiesHybridProps) {
  const currentHost = { ...Host };
  const [modalItem, setModalItem] = useState(null);
  const [, setSearchParams] = useSearchParams();

  const tabs = [
    {
      key: 'past',
      title: <Trans i18nKey="common:labels.past">Past</Trans>,
      onClick: () => setSearchParams({ showPast: 'true' }),
    },
    {
      key: 'upcoming',
      title: <Trans i18nKey="common:labels.upcoming">Upcoming</Trans>,
      onClick: () => setSearchParams({ showPast: 'false' }),
    },
  ];

  const groupsInMenu = currentHost?.settings?.menu?.find(
    (item) => item.name === 'groups'
  );

  const groupsLabel = groupsInMenu?.label;

  const renderPass: boolean = getRenderPass(Host, LISTING, role);
  if (!renderPass) {
    return null;
  }

  return (
    <ListingGenericHybrid
      Host={Host}
      isPortalHost={Boolean(currentHost?.isPortalHost)}
      listing={LISTING}
      modalItem={modalItem}
      onCloseModal={() => setModalItem(null)}
    >
      <Center>
        <Tabs tabs={tabs} index={showPast ? 0 : 1} />
      </Center>

      <InfiniteScroller items={activities} filtrerMarginTop={-72}>
        {(item, index) => (
          <Center
            key={item._id}
            flex="1 1 355px"
            onClick={() => setModalItem(item)}
          >
            <SexyThumb
              activity={item}
              host={currentHost?.isPortalHost ? item.host : null}
              index={index}
              showPast={showPast}
              tags={item.isGroupMeeting ? [groupsLabel] : null}
            />
          </Center>
        )}
      </InfiniteScroller>
    </ListingGenericHybrid>
  );
}
