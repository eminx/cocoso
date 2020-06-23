import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Box, Text, Button, Avatar } from 'grommet';
import Loader from '../../UIComponents/Loader';
import Tag from '../../UIComponents/Tag';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

const imageStyle = {
  width: 288,
  height: 180,
  objectFit: 'cover',
};

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 56%, ${opacity})`;
}

const Works = ({ history }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(null);

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

  const currentUser = Meteor.user();

  const sortedWorks = works.sort(compareByDate);

  const filteredWorks = categoryFilter
    ? sortedWorks.filter((work) => work.category.label === categoryFilter)
    : sortedWorks;

  const categoriesAssignedToWorks = getCategories(works);

  return (
    <Box width="100%" margin={{ bottom: '50px' }} pad="medium">
      <Box margin={{ bottom: 'medium' }} alignSelf="center">
        <Link to={currentUser ? '/new-work' : '/my-profile'}>
          <Button as="span" size="small" label="Create Your Offer" />
        </Link>
      </Box>

      <Box direction="row" justify="center">
        <Tag label="ALL" onClick={() => setCategoryFilter(null)} />
        {categoriesAssignedToWorks.map((cat) => (
          <Tag
            key={cat.label}
            label={cat.label}
            background={
              cat.label === categoryFilter ? getOpacHSL(cat.color) : cat.color
            }
            onClick={() => setCategoryFilter(cat.label)}
          />
        ))}
      </Box>

      <Box direction="row" wrap justify="center">
        {filteredWorks.map((work) => (
          <Box
            key={work._id}
            width="medium"
            pad="medium"
            onClick={() =>
              history.push(`/${work.authorUsername}/work/${work._id}`)
            }
            justify="stretch"
          >
            <Box>
              <Box pad={{ bottom: 'small' }}>
                <Text weight={600} size="large">
                  {work.title}
                </Text>
                <Box direction="row">
                  {work.category && (
                    <Tag
                      label={work.category.label}
                      background={work.category.color}
                    />
                  )}
                  <Avatar flex={{ grow: 0 }} />
                </Box>
              </Box>
              {work.images && work.images[0] && (
                <Box>
                  <LazyLoadImage
                    alt={work.title}
                    src={work.images[0]}
                    style={imageStyle}
                    effect="black-and-white"
                  />
                </Box>
              )}
              <Text weight={300}>{work.shortDescription}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

getCategories = (works) => {
  const labels = Array.from(new Set(works.map((work) => work.category.label)));
  const colors = Array.from(new Set(works.map((work) => work.category.color)));
  return labels.map((label, i) => ({
    label,
    color: colors[i],
  }));
};

getOpacHSL = (color) => {
  return color.substr(0, color.length - 4) + '1)';
};

export default Works;
