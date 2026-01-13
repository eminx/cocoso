import React, { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';
// import { Masonry, usePositioner, useResizeObserver } from 'masonic';

import { currentHostAtom } from '/imports/state';
import { Box, Center, Flex } from '/imports/ui/core';
import InfiniteScroller from '/imports/ui/listing/InfiniteScroller';

import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
// import VirtualGridLister from './VirtualGridLister';
import Tag from '../generic/Tag';
import { getCategoriesAssignedToWorks } from '../../api/_utils/shared';
import NewGridThumb from '/imports/ui/listing/NewGridThumb';

interface WorkThumbProps {
  index: number;
  categories: any[];
  data: any;
  onClick: () => void;
}

function WorkThumb({ index, categories, data, onClick }: WorkThumbProps) {
  const currentHost = useAtomValue(currentHostAtom);
  const work = { ...data };
  return (
    <Box onClick={onClick}>
      <NewGridThumb
        avatar={
          work.showAvatar && {
            name: work.authorUsername,
            url: work.authorAvatar,
          }
        }
        color={
          categories.find((cat) => cat?.label === work.category?.label)?.color
        }
        host={currentHost?.isPortalHost ? work.host : null}
        imageUrl={work?.images && work.images[0]}
        index={index}
        tag={work.category?.label}
        title={work.title}
      />
    </Box>
  );
}

export interface WorksHybridProps {
  Host: any;
  works: any[];
}

export default function WorksHybrid({ Host, works }: WorksHybridProps) {
  const currentHost = useAtomValue(currentHostAtom);
  const [modalItem, setModalItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  const containerRef = useRef(null);

  const setCategoryFilter = (categoryFilter: string) => {
    setSearchParams((params) => {
      params.set('category', categoryFilter);
      return params;
    });
  };

  const getFilteredWorks = () => {
    if (!category || category === 'all') {
      return works;
    }
    return works.filter(
      (work) => work.category && work.category.label === category.toLowerCase()
    );
  };

  const categories = getCategoriesAssignedToWorks(works);

  const worksWithCategoryColors = getFilteredWorks()?.map((work) => {
    const currentCategory = categories.find(
      (cat) => cat?.label === work?.category?.label
    );
    const categoryColor = currentCategory?.color;
    return {
      ...work,
      categoryColor,
    };
  });

  // const getAvatar = (work) =>
  //   work.showAvatar && {
  //     name: work.authorUsername,
  //     url: work.authorAvatar,
  //   };
  // const getColor = (work) =>
  //   categories?.find((cat) => cat?.label === work.category?.label)?.color;
  // const getImageUrl = (work) => work?.images && work.images[0];
  // const getTag = (work) => work.category?.label;
  // const getTitle = (work) => work.title;

  // const WorkItem = useMemo(
  //   () => (props) => {
  //     const itemProps = {
  //       ...props,
  //       categories,
  //       currentHost,
  //       onClick: () => setModalItem(props?.data),
  //     };
  //     return <WorkThumb {...itemProps} />;
  //   },
  //   []
  // );

  return (
    <>
      <PageHeading currentHost={currentHost || Host} listing="works" />

      <Center px="4">
        <Flex justify="center" wrap="wrap">
          <Tag
            key="all"
            filterColor="var(--cocoso-colors-gray-800)"
            label={<Trans i18nKey="members:all">All</Trans>}
            checkable
            checked={Boolean(category) === false || category === 'all'}
            onClick={() => setCategoryFilter('all')}
          />
          {categories.map((cat) => (
            <Tag
              key={cat.label}
              checkable
              checked={category === cat.label}
              filterColor={cat.color}
              label={cat.label}
              onClick={() => setCategoryFilter(cat.label)}
            />
          ))}
        </Flex>
      </Center>

      {/* <Center p="2">
        <Masonry
          // containerRef={containerRef}
          // resizeObserver={resizeObserver}
          columnWidth={360}
          columnGutter={8}
          columnCount={4}
          items={worksWithCategoryColors}
          render={WorkItem}
        />
      </Center> */}

      {/* 
      <Center>
        <VirtualGridLister
          cellProps={{
            currentHost,
            isMasonry: true,
            getAvatar,
            getColor,
            getImageUrl,
            getTag,
            getTitle,
            setModalItem,
          }}
          items={works}
        />
      </Center> */}

      <Box px="2" pb="8">
        <InfiniteScroller isMasonry items={worksWithCategoryColors}>
          {(work, index) => (
            <Box
              key={work._id}
              mb="2"
              css={{
                borderRadius: 'var(--cocoso-border-radius)',
                cursor: 'pointer',
              }}
              onClick={() => setModalItem(work)}
            >
              <NewGridThumb
                avatar={
                  work.showAvatar && {
                    name: work.authorUsername,
                    url: work.authorAvatar,
                  }
                }
                color={
                  categories.find((cat) => cat?.label === work.category?.label)
                    ?.color
                }
                host={currentHost?.isPortalHost ? work.host : null}
                imageUrl={work?.images && work.images[0]}
                index={index}
                tag={work.category?.label}
                title={work.title}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalItem && (
        <PopupHandler
          item={modalItem}
          kind="works"
          onClose={() => setModalItem(null)}
        />
      )}
    </>
  );
}
