import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'grommet';
import { Button } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import WorkThumb from '../../UIComponents/WorkThumb';
import { StateContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Tag from '../../UIComponents/Tag';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';
import { getHslValuesFromLength } from '../../constants/colors';

const publicSettings = Meteor.settings.public;

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function Works({ history }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const { currentUser, currentHost, canCreateContent } =
    useContext(StateContext);

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
    ? sortedWorks.filter((work) => {
        return (
          work.category && work.category.label === categoryFilter.toLowerCase()
        );
      })
    : sortedWorks;

  const categoriesAssignedToWorks = getCategoriesAssignedToWorks(works);

  const worksWithCategoryColors = filteredWorks.map((work, index) => {
    const category = categoriesAssignedToWorks.find((category) => {
      return (
        category.label &&
        category.label ===
          (work.category && work.category.label && work.category.label)
      );
    });
    const categoryColor = category && category.color;
    return {
      ...work,
      categoryColor,
    };
  });

  return (
    <Box width="100%" margin={{ bottom: '50px' }}>
      <Helmet>
        <title>{`Works | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
      </Helmet>
      <Box margin={{ bottom: 'medium' }} alignSelf="center">
        {canCreateContent && (
          <Link to={currentUser ? '/new-work' : '/my-profile'}>
            <Button as="span" colorScheme="green" variant="outline">
              NEW
            </Button>
          </Link>
        )}
      </Box>

      <Box
        direction="row"
        justify="center"
        wrap
        gap="small"
        pad={{ left: 'small' }}
      >
        <Tag
          label="ALL"
          checkable={categoryFilter === null}
          onClick={() => setCategoryFilter(null)}
        />
        {categoriesAssignedToWorks.map((cat) => (
          <Tag
            key={cat.label}
            checkable
            checked={categoryFilter === cat.label}
            filterColor={cat.color}
            label={cat.label && cat.label.toUpperCase()}
            margin={{ bottom: 'small' }}
            onClick={() => setCategoryFilter(cat.label)}
          />
        ))}
      </Box>

      <Box direction="row" justify="center" pad="medium" wrap>
        {worksWithCategoryColors.map((work, index) => (
          <WorkThumb key={work._id} work={work} history={history} />
        ))}
      </Box>
    </Box>
  );
}

getCategoriesAssignedToWorks = (works) => {
  const labels = Array.from(
    new Set(works.map((work) => work.category && work.category.label))
  );

  const hslValues = getHslValuesFromLength(labels.length);
  return labels.map((label, i) => ({
    label,
    color: hslValues[i],
  }));
};

export default Works;
