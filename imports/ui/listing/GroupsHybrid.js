import React, { useState } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Tabs from '../components/Tabs';
import PageHeading from '../components/PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from '../components/InfiniteScroller';
import SexyThumb from '../components/SexyThumb';

export default function GroupsHybrid({ groups, Host, showPast }) {
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('groups');

  const groupsInMenu = Host?.settings?.menu?.find((item) => item.name === 'groups');
  const description = groupsInMenu?.description;
  const heading = groupsInMenu?.label;

  const tabs = [
    {
      title: t('tabs.active'),
      path: 'active',
    },
    {
      title: t('tabs.members'),
      path: 'my',
    },
    {
      title: t('tabs.archived'),
      path: 'archived',
    },
  ];

  return (
    <>
      <PageHeading description={description} heading={heading} />
      {/* <Center p="4">
        <Tabs tabs={tabs} />
      </Center> */}

      <Box px="2">
        <InfiniteScroller items={groups}>
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
          <PopupHandler item={modalItem} kind="groups" onClose={() => setModalItem(null)} />
        )}
      </Box>
    </>
  );
}
