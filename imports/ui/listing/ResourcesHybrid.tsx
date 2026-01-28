import React, { useState } from 'react';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { Box } from '/imports/ui/core';

import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from './InfiniteScroller';
import NewGridThumb from './NewGridThumb';

export interface ResourcesHybridProps {
  Host: any;
  resources: any[];
}

export default function ResourcesHybrid({ Host, resources }: ResourcesHybridProps) {
  const currentHost = useAtomValue(currentHostAtom);
  const [modalItem, setModalItem] = useState(null);

  return (
    <>
      <PageHeading currentHost={currentHost || Host} listing="resources" />

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
                imageUrl={resource.images?.[0]}
                index={index}
                title={resource.label}
              />
            </Box>
          )}
        </InfiniteScroller>

        {modalItem && (
          <PopupHandler
            item={modalItem}
            kind="resources"
            onClose={() => setModalItem(null)}
          />
        )}
      </Box>
    </>
  );
}
