import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';

import PageHeading from '../components/PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from '../components/InfiniteScroller';
import SexyThumb from '../components/SexyThumb';

export default function GroupsHybrid({ groups, Host, showPast }) {
  const [modalItem, setModalItem] = useState(null);

  const groupsInMenu = Host?.settings?.menu?.find((item) => item.name === 'groups');
  const description = groupsInMenu?.description;
  const heading = groupsInMenu?.label;

  return (
    <>
      <PageHeading description={description} heading={heading} />

      <Box px="2">
        <InfiniteScroller items={groups}>
          {(item) => (
            <Box key={item._id} className="sexy-thumb-container" onClick={() => setModalItem(item)}>
              <SexyThumb activity={item} showPast={showPast} />
            </Box>
          )}
        </InfiniteScroller>

        {modalItem && (
          <PopupHandler item={modalItem} kind="groups" onClose={() => setModalItem(null)} />
        )}
      </Box>
    </>
  );
}
