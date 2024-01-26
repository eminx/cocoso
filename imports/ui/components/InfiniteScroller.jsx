import React, { useContext, useMemo, useState } from 'react';
import { Skeleton, Wrap } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-masonry-css';

import NewEntryHelper from './NewEntryHelper';
import { StateContext } from '../LayoutContainer';

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
  const { isDesktop } = useContext(StateContext);

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

  const w = smallThumb || isMasonry ? '2xs' : 'auto';
  const h = smallThumb || isMasonry ? '180px' : '315px';

  return (
    <>
      <InfiniteScroll pageStart={1} loadMore={handleLoad} hasMore={hasMore}>
        {isMasonry ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {currentItems?.map((item) => children(item))}
            {hasMore && <Skeleton endColor="brand.500" h="315px" mt="4" />}
            {!hasMore && canCreateContent && (
              <NewEntryHelper buttonLink={newHelperLink} small={isMasonry || smallThumb} />
            )}
          </Masonry>
        ) : (
          <Wrap justify="center" spacing="2">
            {currentItems?.map((item) => children(item))}
            {hasMore && (
              <Skeleton className="sexy-thumb-container" endColor="brand.500" h={h} w={w} />
            )}
            {!hasMore && canCreateContent && (
              <NewEntryHelper buttonLink={newHelperLink} small={smallThumb} />
            )}
          </Wrap>
        )}
      </InfiniteScroll>
    </>
  );
}

export default InfiniteScroller;
