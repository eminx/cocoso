import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Center } from '/imports/ui/core';

import InfiniteScroller from './InfiniteScroller';
import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import SexyThumb from './SexyThumb';
// import VirtualGridLister from './VirtualGridLister';

export default function GroupsHybrid({ groups, Host }) {
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');

  const groupsInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'groups'
  );
  const description = groupsInMenu?.description;
  const heading = groupsInMenu?.label;
  const url = `${Host?.host}/${groupsInMenu?.name}`;
  const getTags = (item) => (item.isPrivate ? [tc('labels.private')] : null);

  return (
    <>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={Host?.logo}
        url={url}
      />

      {/* <Center>
        <VirtualGridLister
          cellProps={{ Host, getTags, setModalItem }}
          items={groups}
        />
      </Center> */}

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
    </>
  );
}
