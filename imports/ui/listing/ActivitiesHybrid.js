import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { Box, Center } from '/imports/ui/core';

import InfiniteScroller from './InfiniteScroller';
import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import SexyThumb from './SexyThumb';
import Tabs from '../core/Tabs';
// import VirtualGridLister from './VirtualGridLister';

export default function ActivitiesHybrid({ activities, Host, showPast }) {
  const [modalItem, setModalItem] = useState(null);
  const [, setSearchParams] = useSearchParams();

  const activitiesInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'activities'
  );
  const description = activitiesInMenu?.description;
  const heading = activitiesInMenu?.label;

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

  const groupsInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'groups'
  );
  const groupsLabel = groupsInMenu?.label;
  const url = `${Host?.host}/${activitiesInMenu?.name}`;
  const getTags = (item) => (item.isGroupMeeting ? [groupsLabel] : null);

  return (
    <>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={Host?.logo}
        url={url}
      />

      <Center>
        <Tabs tabs={tabs} index={showPast ? 0 : 1} />
      </Center>

      {/* <Center>
        <VirtualGridLister
          cellProps={{ Host, showPast, getTags, setModalItem }}
          items={activities}
        />
      </Center> */}

      <InfiniteScroller items={activities}>
        {(item, index) => (
          <Center
            key={item._id}
            flex="1 1 355px"
            onClick={() => setModalItem(item)}
          >
            <SexyThumb
              activity={item}
              host={Host?.isPortalHost ? item.host : null}
              index={index}
              showPast={showPast}
              tags={item.isGroupMeeting ? [groupsInMenu?.label] : null}
            />
          </Center>
        )}
      </InfiniteScroller>

      {modalItem ? (
        <PopupHandler
          item={modalItem}
          kind="activities"
          showPast={showPast}
          onClose={() => setModalItem(null)}
        />
      ) : null}
    </>
  );
}
