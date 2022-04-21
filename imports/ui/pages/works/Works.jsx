import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, SimpleGrid, Wrap, WrapItem } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import WorkThumb from '../../components/WorkThumb';
import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Tag from '../../components/Tag';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { getHslValuesFromLength } from '../../utils/constants/colors';

const publicSettings = Meteor.settings.public;

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function Works() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const { currentUser, currentHost, canCreateContent } = useContext(StateContext);
  const [tc] = useTranslation('common');

  useEffect(() => {
    getAllWorks();
  }, []);

  const getAllWorks = async () => {
    try {
      const response = await call('getAllWorks');
      setWorks(response);
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      setLoading(false);
    }
  };

  if (loading || !works) {
    return <Loader />;
  }

  const sortedWorks = works.sort(compareByDate);

  const filteredWorks = categoryFilter
    ? sortedWorks.filter(
        (work) => work.category && work.category.label === categoryFilter.toLowerCase()
      )
    : sortedWorks;

  const categoriesAssignedToWorks = getCategoriesAssignedToWorks(works);

  const worksWithCategoryColors = filteredWorks.map((work, index) => {
    const category = categoriesAssignedToWorks.find(
      (category) =>
      category.label &&
        category.label === (work.category && work.category.label && work.category.label)
    ));
    const categoryColor = category && category.color;
    return {
      ...work,
      categoryColor,
    };
  });

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.works')} | ${currentHost.settings.name} | ${
          publicSettings.name
        }`}</title>
        </Helmet>

      <Center mb="4">
        {canCreateContent && (
          <Link to={currentUser ? '/new-work' : '/my-profile'}>
            <Button as="span" colorScheme="green" variant="outline" textTransform="uppercase">
              {tc('actions.create')}
              </Button>
        </Link>
        )}
        </Center>

      <Center mb="4">
        <Wrap pl="2" justify="center">
          <WrapItem>
            <Tag
              label="ALL"
              checkable={categoryFilter === null}
              onClick={() => setCategoryFilter(null)}
            />
            </WrapItem>
          {categoriesAssignedToWorks.map((cat) => (
            <WrapItem key={cat.label}>
              <Tag
                checkable
                checked={categoryFilter === cat.label}
                filterColor={cat.color}
                label={cat.label && cat.label.toUpperCase()}
                margin={{ bottom: 'small' }}
                onClick={() => setCategoryFilter(cat.label)}
              />
              </WrapItem>
          ))}
          </Wrap>
        </Center>

      <Center px="2">
        <SimpleGrid columns={[1, 1, 2, 3]} spacing={3} w="100%">
          {worksWithCategoryColors.map((work, index) => (
            <Box key={work._id} w="100%">
              <Link to={`/${work.authorUsername}/work/${work._id}`}>
                <WorkThumb work={work} />
                </Link>
              </Box>
          ))}
          </SimpleGrid>
        </Center>
      </Box>
  );
}

getCategoriesAssignedToWorks = (works) => {
  const labels = Array.from(new Set(works.map((work) => work.category && work.category.label)));

  const hslValues = getHslValuesFromLength(labels.length);
  return labels.map((label, i) => ({
    label,
    color: hslValues[i],
  }));
};

export default Works;
