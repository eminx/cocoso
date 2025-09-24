import React, { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-masonry-css';

import { Box, Center, Flex, Loader } from '/imports/ui/core';

import NewEntryHelper from '../generic/NewEntryHelper';
import FiltrerSorter from './FiltrerSorter';

const breakpointColumnsObj = (isLarger) => ({
  default: 6,
  2440: isLarger ? 5 : 3,
  1920: isLarger ? 4 : 2,
  1420: isLarger ? 3 : 2,
  760: isLarger ? 2 : 1,
  480: 1,
});

const defaultItemsPerPage = 12;

const filterHelper = (item, lowerCaseFilterValue) => {
  const { title, subTitle, shortDescription, label, readingMaterial } = item;

  const checker = (field) => {
    if (!field) {
      return false;
    }
    return field.toLowerCase().indexOf(lowerCaseFilterValue) !== -1;
  };

  const itemFiltered =
    checker(label) ||
    checker(readingMaterial) ||
    checker(subTitle) ||
    checker(shortDescription) ||
    checker(title);

  return itemFiltered;
};

const filterItems = (items, filterValue) => {
  if (!filterValue || filterValue === '') {
    return items;
  }

  return items.filter((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const lowerCaseFilterValue = filterValue.toLowerCase();

    return filterHelper(item, lowerCaseFilterValue);
  });
};

const sortItems = (items, sortValue) => {
  if (!sortValue || sortValue === '') {
    return items;
  }

  return items.sort((a, b) => {
    if (sortValue === 'name') {
      return a.label
        ? a.label?.localeCompare(b.label)
        : a.title?.localeCompare(b.title);
    }
    return (
      new Date(b.createdAt || b.creationDate) -
      new Date(a.createdAt || a.creationDate)
    );
  });
};

const filterSortItems = (
  items,
  filterValue,
  sortValue,
  currentPage,
  itemsPerPage
) => {
  if (!items) {
    return [];
  }
  const filteredItems = filterItems(items, filterValue);
  const filteredSortedItems = sortItems(filteredItems, sortValue);
  return filteredSortedItems.slice(0, itemsPerPage * currentPage);
};

export default function InfiniteScroller({
  canCreateContent = false,
  hideFiltrerSorter = false,
  filtrerMarginTop = 0,
  isMasonry = false,
  items,
  itemsPerPage = defaultItemsPerPage,
  newHelperLink,
  smallThumb,
  children,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  const currentItems = useMemo(
    () =>
      filterSortItems(items, filterValue, sortValue, currentPage, itemsPerPage),
    [items, filterValue, sortValue, currentPage]
  );

  const handleLoad = () => {
    setTimeout(() => {
      setCurrentPage(currentPage + 1);
    }, 300);
  };

  const hasMore =
    items?.length > currentItems?.length &&
    currentItems?.length >= itemsPerPage;

  const filtrerProps = {
    filterValue,
    setFilterValue: (v) => setFilterValue(v),
    sortValue,
    setSortValue: (v) => setSortValue(v),
  };

  return (
    <>
      {!hideFiltrerSorter && (
        <Flex
          justify="flex-end"
          css={{
            '@media(min-width: 960px)': { marginTop: `${filtrerMarginTop}px` },
          }}
        >
          <FiltrerSorter {...filtrerProps} />
        </Flex>
      )}

      <Box px="2" pb="8" w="100%">
        <InfiniteScroll pageStart={1} loadMore={handleLoad} hasMore={hasMore}>
          {isMasonry ? (
            <Masonry
              breakpointCols={breakpointColumnsObj(currentItems?.length > 3)}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {currentItems?.map((item, index) => children(item, index))}
              {hasMore && <Loader relative />}
              {!hasMore && canCreateContent && (
                <NewEntryHelper
                  buttonLink={newHelperLink}
                  small={isMasonry || smallThumb}
                />
              )}
            </Masonry>
          ) : (
            <Flex align="center" justify="center" gap="2" wrap="wrap" w="100%">
              {currentItems?.map((item, index) => children(item, index))}
              {hasMore && <Loader relative />}
              {!hasMore && canCreateContent && (
                <NewEntryHelper
                  buttonLink={newHelperLink}
                  small={smallThumb || isMasonry}
                />
              )}
            </Flex>
          )}
        </InfiniteScroll>
      </Box>
    </>
  );
}
