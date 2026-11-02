import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Center } from '/imports/ui/core';
import { Host } from '/imports/ui/types';

import ListingGenericHybrid from './ListingGenericHybrid';
import InfiniteScroller from './InfiniteScroller';
import SexyThumb from './SexyThumb';

export interface GroupsHybridProps {
  Host: Host;
  groups: any[];
}

const LISTING = 'groups';

export default function GroupsHybrid({ Host, groups }: GroupsHybridProps) {
  const currentHost = { ...Host };
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');

  return (
    <ListingGenericHybrid
      Host={Host}
      isPortalHost={Boolean(currentHost?.isPortalHost)}
      listing={LISTING}
      modalItem={modalItem}
      onCloseModal={() => setModalItem(null)}
    >
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
    </ListingGenericHybrid>
  );
}
