import React, { useMemo, useState } from 'react';
import { Skeleton, Wrap } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-masonry-css';

import NewEntryHelper from './NewEntryHelper';

const breakpointColumnsObj = {
  default: 4,
  1900: 5,
  1500: 4,
  1100: 3,
  700: 2,
  480: 1,
};

const defaultItemsPerPage = 12;

function InfiniteScroller({
  canCreateContent = false,
  isMasonry = false,
  items,
  itemsPerPage = defaultItemsPerPage,
  newHelperLink,
  smallThumb,
  children,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentItems = useMemo(
    () => items.slice(0, itemsPerPage * currentPage),
    [items, currentPage]
  );

  const handleLoad = () => {
    setTimeout(() => {
      setCurrentPage(currentPage + 1);
    }, 300);
  };

  const hasMore = items.length > currentItems.length;

  const skeletonWidth = smallThumb || isMasonry ? '2xs' : 'auto';
  const skeletonHeight = smallThumb || isMasonry ? '180px' : '315px';

  return (
    <>
      <InfiniteScroll pageStart={1} loadMore={handleLoad} hasMore={hasMore} data-oid="iyn1lv0">
        {isMasonry ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            data-oid="92rll0h"
          >
            {currentItems?.map((item) => children(item))}
            {hasMore && (
              <Skeleton endColor="gray.300" w="185px" h="185px" m="4" data-oid="sk8idf7" />
            )}
            {!hasMore && canCreateContent && (
              <NewEntryHelper
                buttonLink={newHelperLink}
                small={isMasonry || smallThumb}
                data-oid="5rdgy.2"
              />
            )}
          </Masonry>
        ) : (
          <Wrap align="center" justify="center" spacing="2" data-oid="rvtg18p">
            {currentItems?.map((item) => children(item))}
            {hasMore && (
              <Skeleton
                className="sexy-thumb-container"
                endColor="gray.300"
                h={skeletonHeight}
                w={skeletonWidth}
                data-oid="ns80hs6"
              />
            )}
            {!hasMore && canCreateContent && (
              <NewEntryHelper
                buttonLink={newHelperLink}
                small={smallThumb || isMasonry}
                data-oid="j2s7dc9"
              />
            )}
          </Wrap>
        )}
      </InfiniteScroll>
    </>
  );
}

export default InfiniteScroller;
