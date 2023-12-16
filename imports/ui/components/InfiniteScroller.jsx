import React, { useContext, useMemo, useState } from 'react';
import { Box, Center, Flex, Skeleton, Wrap } from '@chakra-ui/react';
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

  return (
    <>
      <InfiniteScroll
        pageStart={1}
        loadMore={handleLoad}
        hasMore={hasMore}
        loader={
          !isDesktop ? (
            <Box>
              <Center>
                <Skeleton endColor="brand.500" w="355px" h="315px" mt="8" />
              </Center>
            </Box>
          ) : (
            <Flex>
              <Skeleton endColor="brand.500" w="2xs" h="180px" mr="8" mt="8" />
              <Skeleton endColor="brand.500" w="2xs" h="180px" mr="8" mt="8" />
              <Skeleton endColor="brand.500" w="2xs" h="180px" mr="8" mt="8" />
            </Flex>
          )
        }
      >
        {isMasonry ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {currentItems?.map((item) => children(item))}
            {hasMore && <Skeleton endColor="brand.500" h="315px" mt="8" />}
            {!hasMore && canCreateContent && (
              <NewEntryHelper buttonLink={newHelperLink} isMasonry={isMasonry} />
            )}
          </Masonry>
        ) : (
          <Wrap justify={isDesktop ? 'flex-start' : 'center'} spacing="8">
            {currentItems?.map((item) => children(item))}
            {!hasMore && canCreateContent && (
              <NewEntryHelper buttonLink={newHelperLink} small={isMasonry || smallThumb} />
            )}
          </Wrap>
        )}
      </InfiniteScroll>
    </>
  );
}

export default InfiniteScroller;
