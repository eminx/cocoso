import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Box, Center, Flex } from '/imports/ui/core';

import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import VirtualGridLister from './VirtualGridLister';
import Tag from '../generic/Tag';
import { getCategoriesAssignedToWorks } from '../utils/shared';

export default function WorksHybrid({ works, Host }) {
  const [modalItem, setModalItem] = useState(null);
  const [t] = useTranslation('members');
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');

  const setCategoryFilter = (categoryFilter) => {
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

  const worksWithCategoryColors = getFilteredWorks().map((work) => {
    const currentCategory = categories.find(
      (cat) => cat?.label === work?.category?.label
    );
    const categoryColor = currentCategory?.color;
    return {
      ...work,
      categoryColor,
    };
  });

  const worksInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'works'
  );
  const description = worksInMenu?.description;
  const heading = worksInMenu?.label;
  const url = `${Host?.host}/${worksInMenu?.name}`;

  const getAvatar = (work) =>
    work.showAvatar && {
      name: work.authorUsername,
      url: work.authorAvatar,
    };
  const getColor = (work) =>
    categories?.find((cat) => cat?.label === work.category?.label)?.color;
  const getImageUrl = (work) => work?.images && work.images[0];
  const getTag = (work) => work.category?.label;
  const getTitle = (work) => work.title;

  return (
    <>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={Host?.logo}
        url={url}
      />

      <Center px="4">
        <Flex justify="center" wrap="wrap">
          <Tag
            key="all"
            filterColor="var(--cocoso-colors-gray-800)"
            label={t('all')}
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

      <Center>
        <VirtualGridLister
          cellProps={{
            Host,
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
      </Center>

      {/* <Box px="2" pb="8">
        <InfiniteScroller isMasonry items={worksWithCategoryColors}>
          {(work, index) => (
            <Box
              key={work._id}
              borderRadius="lg"
              cursor="pointer"
              mb="2"
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
                host={Host?.isPortalHost ? work.host : null}
                imageUrl={work?.images && work.images[0]}
                index={index}
                tag={work.category?.label}
                title={work.title}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>
       */}
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
