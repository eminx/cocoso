import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from 'grommet';
import { FormAdd } from 'grommet-icons';

import Work from '../../UIComponents/Work';
import { StateContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Tag from '../../UIComponents/Tag';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 56%, ${opacity})`;
}

const Works = ({ history }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const { currentUser, canCreateContent } = useContext(StateContext);

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
      <Box margin={{ bottom: 'medium' }} alignSelf="center">
        {canCreateContent && (
          <Link to={currentUser ? '/new-work' : '/my-profile'}>
            <Button
              as="span"
              size="small"
              label="NEW"
              // primary
              // icon={<FormAdd />}
            />
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
            label={cat.label}
            background={
              cat.label === categoryFilter ? getOpacHSL(cat.color) : cat.color
            }
            margin={{ bottom: 'small' }}
            onClick={() => setCategoryFilter(cat.label)}
          />
        ))}
      </Box>

      <Box direction="row" justify="center" pad="medium" wrap>
        {filteredWorks.map((work, index) => (
          <Work key={work._id} work={work} history={history} />
        ))}
      </Box>
    </Box>
  );
};

getCategories = (works) => {
  const labels = Array.from(
    new Set(works.map((work) => work.category && work.category.label))
  );
  const colors = Array.from(
    new Set(works.map((work) => work.category && work.category.color))
  );
  return labels.map((label, i) => ({
    label,
    color: colors[i],
  }));
};

getOpacHSL = (color) => {
  return color ? color.substr(0, color.length - 4) + '1)' : null;
};

export default Works;
