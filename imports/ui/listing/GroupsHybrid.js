import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { Box, Center } from '/imports/ui/core';

import InfiniteScroller from './InfiniteScroller';
import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import SexyThumb from './SexyThumb';
// import VirtualGridLister from './VirtualGridLister';

export default function GroupsHybrid({ groups }) {
  const currentHost = useAtomValue(currentHostAtom);
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');

  const groupsInMenu = currentHost?.settings?.menu?.find(
    (item) => item.name === 'groups'
  );
  const description = groupsInMenu?.description;
  const heading = groupsInMenu?.label;
  const url = `${currentHost?.host}/${groupsInMenu?.name}`;
  const getTags = (item) => (item.isPrivate ? [tc('labels.private')] : null);

  return (
    <>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={currentHost?.logo}
        url={url}
      />

      {/* <Center>
        <VirtualGridLister
          cellProps={{ currentHost, getTags, setModalItem }}
          items={groups}
        />
      </Center> */}

      <InfiniteScroller items={groups} filtrerMarginTop={-76}>
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
