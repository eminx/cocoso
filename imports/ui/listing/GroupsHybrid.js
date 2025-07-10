import React, { useState } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from './InfiniteScroller';
import SexyThumb from './SexyThumb';

export default function GroupsHybrid({ groups, Host }) {
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');

  const groupsInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'groups'
  );
  const description = groupsInMenu?.description;
  const heading = groupsInMenu?.label;
  const url = `${Host?.host}/${groupsInMenu?.name}`;

  return (
    <>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={Host?.logo}
        url={url}
      />

      <Box px="2" pb="8">
        <InfiniteScroller items={groups}>
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
                tags={item.isPrivate ? [tc('labels.private')] : null}
              />
            </Center>
          )}
        </InfiniteScroller>

        {modalItem && (
          <PopupHandler
            item={modalItem}
            kind="groups"
            onClose={() => setModalItem(null)}
          />
        )}
      </Box>
    </>
  );
}
