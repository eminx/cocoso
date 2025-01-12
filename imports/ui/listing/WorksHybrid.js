import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Center, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Tabs from '../components/Tabs';
import PageHeading from '../components/PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from '../components/InfiniteScroller';
import NewGridThumb from '../components/NewGridThumb';
import Tag from '../components/Tag';
import { getCategoriesAssignedToWorks } from '../utils/shared';

export default function WorksHybrid({ works, Host }) {
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  let [searchParams, setSearchParams] = useSearchParams();
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
    } else {
      return works.filter((work) => {
        return work.category && work.category.label === category.toLowerCase();
      });
    }
  };

  const categories = getCategoriesAssignedToWorks(works);

  const worksWithCategoryColors = getFilteredWorks().map((work, index) => {
    const category = categories.find((category) => {
      return category.label && category.label === work?.category?.label;
    });
    const categoryColor = category?.color;
    return {
      ...work,
      categoryColor,
    };
  });

  const worksInMenu = Host?.settings?.menu?.find((item) => item.name === 'works');
  const description = worksInMenu?.description;
  const heading = worksInMenu?.label;

  return (
    <>
      <PageHeading description={description} heading={heading} />
      <Center p="4">
        <Flex justify="center" wrap="wrap">
          <Tag
            label={t('all')}
            checkable
            checked={Boolean(category) === false || category === 'all'}
            mb="2"
            mr="2"
            onClick={() => setCategoryFilter('all')}
          />
          {categories.map((cat) => (
            <Tag
              key={cat.label}
              checkable
              checked={category === cat.label}
              filterColor={cat.color}
              label={cat.label && cat.label.toUpperCase()}
              mb="2"
              mr="2"
              onClick={() => setCategoryFilter(cat.label)}
            />
          ))}
        </Flex>
      </Center>

      <Box px="2">
        <InfiniteScroller isMasonry items={worksWithCategoryColors}>
          {(work) => (
            <Box
              key={work._id}
              borderRadius="8px"
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
                color={categories.find((cat) => cat?.label === work.category?.label)?.color}
                // host={isPortalHost && allHosts?.find((h) => h.host === work.host)?.name}
                imageUrl={work?.images && work.images[0]}
                tag={work.category?.label}
                title={work.title}
              />
            </Box>
          )}
        </InfiniteScroller>

        {modalItem && (
          <PopupHandler item={modalItem} kind="works" onClose={() => setModalItem(null)} />
        )}
      </Box>
    </>
  );
}
