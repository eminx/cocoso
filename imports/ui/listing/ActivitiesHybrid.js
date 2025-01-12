import React, { useState } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Tabs from '../components/Tabs';
import PageHeading from '../components/PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from '../components/InfiniteScroller';
import SexyThumb from '../components/SexyThumb';

export default function ActivitiesHybrid({ activities, Host, showPast }) {
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');

  const activitiesInMenu = Host?.settings?.menu?.find((item) => item.name === 'activities');
  const description = activitiesInMenu?.description;
  const heading = activitiesInMenu?.label;

  const tabs = [
    {
      path: '/activities?showPast=true',
      title: tc('labels.past'),
    },
    {
      path: '/activities',
      title: tc('labels.upcoming'),
    },
  ];

  return (
    <>
      <PageHeading description={description} heading={heading} />
      <Center pb="4">
        <Tabs tabs={tabs} index={showPast ? 0 : 1} />
      </Center>

      <Box px="2">
        <InfiniteScroller items={activities}>
          {(item) => {
            return (
              <Box
                key={item._id}
                className="sexy-thumb-container"
                onClick={() => setModalItem(item)}
              >
                <SexyThumb activity={item} showPast={showPast} />
              </Box>
            );
          }}
        </InfiniteScroller>

        {modalItem && (
          <PopupHandler item={modalItem} kind="activities" onClose={() => setModalItem(null)} />
        )}
      </Box>
    </>
  );
}
