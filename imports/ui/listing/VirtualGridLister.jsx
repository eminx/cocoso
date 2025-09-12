import { Meteor } from 'meteor/meteor';
import React, { useMemo, useState } from 'react';
import { Grid } from 'react-window';

import { Box, Flex } from '/imports/ui/core';

import FiltrerSorter from './FiltrerSorter';
import NewGridThumb from './NewGridThumb';
import SexyThumb from './SexyThumb';

const defaultItemsPerPage = 12;
const COLUMN_COUNT = 3;
const ITEM_HEIGHT = 337;

const isClient = Meteor.isClient;

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

const filterSortItems = (items, filterValue, sortValue) => {
  if (!items) {
    return [];
  }
  const filteredItems = filterItems(items, filterValue);
  return sortItems(filteredItems, sortValue);
};

function ThumbItem({
  color,
  columnCount,
  columnIndex,
  Host,
  isMasonry,
  items,
  rowIndex,
  showPast,
  style,
  getAvatar,
  getColor,
  getImageUrl,
  getTag,
  getTags,
  getTitle,
  setModalItem,
}) {
  const index = rowIndex * columnCount + columnIndex;

  if (items && index >= items.length) {
    return null;
  }

  const item = items && items[index];
  const host = Host?.isPortalHost ? item.host : null;

  if (!item) {
    return null;
  }

  if (isMasonry) {
    return (
      <Box key={item._id} style={style} onClick={() => setModalItem(item)}>
        <NewGridThumb
          avatar={getAvatar(item)}
          color={getColor(item)}
          host={host}
          imageUrl={getImageUrl}
          index={index}
          tag={getTag(item)}
          title={getTitle(item)}
        />
      </Box>
    );
  }

  return (
    <Box key={item._id} p="1" style={style} onClick={() => setModalItem(item)}>
      <SexyThumb
        activity={item}
        host={host}
        index={index}
        showPast={showPast}
        tags={getTags(item)}
      />
    </Box>
  );
}

export default function VirtualGridLister({
  cellProps,
  height = 800,
  hideFiltrerSorter = false,
  isMasonry = false,
  items,
  smallThumb = false,
}) {
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  const currentItems = useMemo(
    () => filterSortItems(items, filterValue, sortValue),
    [items, filterValue, sortValue]
  );

  const cellComponent = useMemo(() => ThumbItem, [isMasonry]);

  const filtrerProps = {
    filterValue,
    setFilterValue: (v) => setFilterValue(v),
    sortValue,
    setSortValue: (v) => setSortValue(v),
  };

  const columnWidth = isClient ? window.screen?.width / COLUMN_COUNT - 18 : 355;
  const rowCount = Math.ceil(items.length / 3);

  return (
    <div>
      {!hideFiltrerSorter && (
        <Flex justify="flex-end">
          <FiltrerSorter {...filtrerProps} />
        </Flex>
      )}

      <Grid
        cellComponent={cellComponent}
        cellProps={{
          ...cellProps,
          items: currentItems,
          columnCount: COLUMN_COUNT,
        }}
        columnCount={COLUMN_COUNT}
        columnWidth={columnWidth}
        height={height}
        rowCount={rowCount}
        rowHeight={ITEM_HEIGHT}
        width={columnWidth * COLUMN_COUNT}
      />
    </div>
  );
}
