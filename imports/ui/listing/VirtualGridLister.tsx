import { Meteor } from 'meteor/meteor';
import React, { useMemo, useState } from 'react';
import { Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Box, Flex } from '/imports/ui/core';
import useMediaQuery from '/imports/api/_utils/useMediaQuery';

import FiltrerSorter from './FiltrerSorter';
import NewGridThumb from './NewGridThumb';
import SexyThumb from './SexyThumb';

const defaultItemsPerPage = 12;
const ITEM_HEIGHT = 337;

const isClient = Meteor.isClient;

const filterHelper = (item: any, lowerCaseFilterValue: string): boolean => {
  const { title, subTitle, shortDescription, label, readingMaterial } = item;

  const checker = (field?: string): boolean => {
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

const filterItems = (items: any[], filterValue: string): any[] => {
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

const sortItems = (items: any[], sortValue: string): any[] => {
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
      new Date(b.createdAt || b.creationDate).getTime() -
      new Date(a.createdAt || a.creationDate).getTime()
    );
  });
};

const filterSortItems = (items: any[], filterValue: string, sortValue: string): any[] => {
  if (!items) {
    return [];
  }
  const filteredItems = filterItems(items, filterValue);
  return sortItems(filteredItems, sortValue);
};

interface ThumbItemProps {
  color?: string;
  columnCount: number;
  columnIndex: number;
  Host?: any;
  isMasonry?: boolean;
  items: any[];
  rowIndex: number;
  showPast?: boolean;
  style: React.CSSProperties;
  getAvatar: (item: any) => any;
  getColor: (item: any) => string;
  getImageUrl: string;
  getTag: (item: any) => string;
  getTags: (item: any) => string[];
  getTitle: (item: any) => string;
  setModalItem: (item: any) => void;
}

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
}: ThumbItemProps) {
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

export interface VirtualGridListerProps {
  cellProps?: any;
  height?: number;
  hideFiltrerSorter?: boolean;
  isMasonry?: boolean;
  items: any[];
  smallThumb?: boolean;
}

export default function VirtualGridLister({
  cellProps,
  height = 800,
  hideFiltrerSorter = false,
  isMasonry = false,
  items,
  smallThumb = false,
}: VirtualGridListerProps) {
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  const currentItems = useMemo(
    () => filterSortItems(items, filterValue, sortValue),
    [items, filterValue, sortValue]
  );

  const CellComponent = useMemo(() => ThumbItem, [isMasonry]);

  const filtrerProps = {
    filterValue,
    setFilterValue: (v) => setFilterValue(v),
    sortValue,
    setSortValue: (v) => setSortValue(v),
  };

  const isDesktop = isClient ? useMediaQuery('(min-width: 1280px)') : true;
  const isMobile = isClient ? useMediaQuery('(max-width: 720px)') : false;
  const columnCount = isDesktop ? 3 : isMobile ? 1 : 2;

  const screenWidth =
    window || document
      ? window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      : 1440;
  const columnWidth = screenWidth / columnCount - columnCount * 2;
  const rowCount = Math.ceil(items.length / columnCount);

  return (
    <div>
      {!hideFiltrerSorter && (
        <Flex justify="flex-end">
          <FiltrerSorter {...filtrerProps} />
        </Flex>
      )}

      <Grid
        cellComponent={CellComponent}
        cellProps={{
          ...cellProps,
          items: currentItems,
          columnCount: columnCount,
        }}
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={height}
        rowCount={rowCount}
        rowHeight={ITEM_HEIGHT}
        width={screenWidth}
      />
    </div>
  );
}
