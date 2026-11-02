import React, { useState } from 'react';

import { Box } from '/imports/ui/core';
import { Host } from '/imports/ui/types';
import { getImageUrl } from '/imports/ui/utils/imageHelper';

import ListingGenericHybrid from './ListingGenericHybrid';
import InfiniteScroller from './InfiniteScroller';
import NewGridThumb from './NewGridThumb';

export interface ResourcesHybridProps {
  Host: Host;
  resources: object[];
}

const LISTING = 'resources';

export default function ResourcesHybrid({
  Host,
  resources,
}: ResourcesHybridProps) {
  const currentHost = { ...Host };
  const [modalItem, setModalItem] = useState(null);

  return (
    <ListingGenericHybrid
      Host={Host}
      isPortalHost={Boolean(currentHost?.isPortalHost)}
      listing={LISTING}
      modalItem={modalItem}
      onCloseModal={() => setModalItem(null)}
    >
      <Box px="2" pb="8">
        <InfiniteScroller isMasonry items={resources} filtrerMarginTop={-82}>
          {(resource, index) => (
            <Box
              key={resource._id}
              mb="2"
              css={{
                borderRadius: 'var(--cocoso-border-radius)',
                cursor: 'pointer',
              }}
              onClick={() => setModalItem(resource)}
            >
              <NewGridThumb
                fixedImageHeight
                host={currentHost?.isPortalHost ? resource.host : null}
                imageUrl={getImageUrl(resource.images?.[0], 'small')}
                index={index}
                title={resource.label}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>
    </ListingGenericHybrid>
  );
}
