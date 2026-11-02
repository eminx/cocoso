import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { roleAtom } from '/imports/state';
import { Center } from '/imports/ui/core';

import { getRenderPass } from './helpers';
import InfiniteScroller from './InfiniteScroller';
import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import SexyThumb from './SexyThumb';
import ShowContentFromOtherHosts from './ShowContentFromOtherHosts';
import Tabs from '../core/Tabs';

export interface ActivitiesHybridProps {
  Host: any;
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
  const role = useAtomValue(roleAtom);
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
    <>
      <PageHeading currentHost={currentHost} listing={LISTING} />

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

      <ShowContentFromOtherHosts
        isPortalHost={currentHost?.isPortalHost}
        listing="activities"
      />

      <PopupHandler
        item={modalItem}
        kind="activities"
        showPast={showPast}
        onClose={() => setModalItem(null)}
      />
    </>
  );
}
