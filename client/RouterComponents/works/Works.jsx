import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from 'grommet';
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

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 56%, ${opacity})`;
}

export default function Works({ history }) {
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
    ? sortedWorks.filter(
        (work) => work.category && work.category.label === categoryFilter
      )
    : sortedWorks;

  const categoriesAssignedToWorks = getCategories(works);

  return (
    <Box width="100%" margin={{ bottom: '50px' }}>
      <Helmet>
        <title>{`Works | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
      </Helmet>
      <Box margin={{ bottom: 'medium' }} alignSelf="center">
        {canCreateContent && (
          <Link to={currentUser ? '/new-work' : '/my-profile'}>
            <Button as="span" size="small" label="NEW" />
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
        <Tag label="ALL" onClick={() => setCategoryFilter(null)} />
        {categoriesAssignedToWorks.map((cat) => (
          <Tag
            key={cat.label}
            checkable
            checked={categoryFilter === cat.label}
            filterColor={cat.color}
            label={cat.label}
            margin={{ bottom: 'small' }}
            onClick={() => setCategoryFilter(cat.label)}
          />
        ))}
      </Box>

      <Box direction="row" justify="center" pad="medium" wrap>
        {filteredWorks.map((work, index) => (
          <WorkThumb key={work._id} work={work} history={history} />
        ))}
      </Box>
    </Box>
  );
}

getCategories = (works) => {
  const labels = Array.from(
    new Set(works.map((work) => work.category && work.category.label))
  );

  const hslValues = getHslValuesFromLength(labels.length);
  return labels.map((label, i) => ({
    label: label && label.toUpperCase(),
    color: hslValues[i],
  }));
};

getOpacHSL = (color) => {
  return color ? color.substr(0, color.length - 4) + '1)' : null;
};
