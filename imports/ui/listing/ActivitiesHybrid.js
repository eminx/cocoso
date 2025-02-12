import React, { useState } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

import Tabs from '../entry/Tabs';
import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from './InfiniteScroller';
import SexyThumb from './SexyThumb';

export default function ActivitiesHybrid({ activities, Host, showPast }) {
  const [modalItem, setModalItem] = useState(null);

  const activitiesInMenu = Host?.settings?.menu?.find((item) => item.name === 'activities');
  const description = activitiesInMenu?.description;
  const heading = activitiesInMenu?.label;

  const tabs = [
    {
      path: '/activities?showPast=true',
      title: (
        <Trans i18nKey="labels.past" ns="common">
          Past
        </Trans>
      ),
    },
    {
      path: '/activities',
      title: (
        <Trans i18nKey="labels.upcoming" ns="common">
          Upcoming
        </Trans>
      ),
    },
  ];

  return (
    <>
      <PageHeading description={description} heading={heading} />
      <Center pb="4">
        <Tabs tabs={tabs} index={showPast ? 0 : 1} />
      </Center>

      <Box px="2" pb="8">
        <InfiniteScroller items={activities}>
          {(item, index) => (
            <Center key={item._id} flex="1 1 355px" onClick={() => setModalItem(item)}>
              <SexyThumb
                activity={item}
                host={Host?.isPortalHost ? item.host : null}
                index={index}
                showPast={showPast}
              />
            </Center>
          )}
        </InfiniteScroller>

        {modalItem && (
          <PopupHandler item={modalItem} kind="activities" onClose={() => setModalItem(null)} />
        )}
      </Box>
    </>
  );
}
