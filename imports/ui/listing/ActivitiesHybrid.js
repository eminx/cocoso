import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Grid } from 'react-window';

import { Box, Center } from '/imports/ui/core';

import Tabs from '../core/Tabs';
import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from './InfiniteScroller';
import SexyThumb from './SexyThumb';

const COLUMN_COUNT = 3;
const ITEM_HEIGHT = 337; // Adjust based on your thumb height

function GridItem({ activities, columnIndex, rowIndex, style, setModalItem }) {
  // const item = activities[rowIndex * 3];

  const index = rowIndex * COLUMN_COUNT + columnIndex;

  if (index >= activities.length) {
    return null; // Don't render anything for empty cells
  }

  const item = activities[index];

  return (
    <Box key={item._id} p="1" style={style} onClick={() => setModalItem(item)}>
      <SexyThumb
        activity={item}
        // host={Host?.isPortalHost ? item.host : null}
        index={index}
        // showPast={showPast}
        // tags={item.isGroupMeeting ? [groupsInMenu?.label] : null}
      />
    </Box>
  );
}

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
      title: (
        <Trans i18nKey="labels.past" ns="common">
          Past
        </Trans>
      ),
      onClick: () => setSearchParams({ showPast: 'true' }),
    },
    {
      key: 'upcoming',
      title: (
        <Trans i18nKey="labels.upcoming" ns="common">
          Upcoming
        </Trans>
      ),
      onClick: () => setSearchParams({ showPast: 'false' }),
    },
  ];

  const groupsInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'groups'
  );
  const url = `${Host?.host}/${activitiesInMenu?.name}`;

  const columnWidth = window?.screen?.width / COLUMN_COUNT - 18;
  const rowCount = Math.ceil(activities.length / 3);

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

      <Center px="2" pb="8">
        <Grid
          cellComponent={GridItem}
          cellProps={{ activities, setModalItem }}
          columnCount={COLUMN_COUNT}
          columnWidth={columnWidth}
          height={800}
          rowCount={rowCount}
          rowHeight={ITEM_HEIGHT}
          width={columnWidth * COLUMN_COUNT}
        />

        {/* <InfiniteScroller items={activities}>
          {(item, index) => (
            <Center
              key={item._id}
              flex="1 1 355px"
              p="1"
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
        </InfiniteScroller> */}

        {modalItem && (
          <PopupHandler
            item={modalItem}
            kind="activities"
            showPast={showPast}
            onClose={() => setModalItem(null)}
          />
        )}
      </Center>
    </>
  );
}
