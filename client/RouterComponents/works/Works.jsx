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
    ? sortedWorks.filter((work) => work.category === categoryFilter)
    : sortedWorks;

  const categoriesAssignedToWorks = Array.from(
    new Set(
      works.map((work) => work.category).filter((cat) => cat && cat.length > 3)
    )
  );

  return (
    <Box width="100%" margin={{ bottom: '50px' }} pad="medium">
      <Box margin={{ bottom: 'medium' }} alignSelf="center">
        <Link to={currentUser ? '/new-work' : '/my-profile'}>
          <Button as="span" size="small" label="Create Your Market" />
        </Link>
      </Box>

      <Box direction="row" justify="center">
        <Tag label="ALL" onClick={() => setCategoryFilter(null)} />
        {categoriesAssignedToWorks.map((cat) => (
          <Tag
            key={cat}
            elevation="small"
            label={cat}
            onClick={() => setCategoryFilter(cat)}
          />
        ))}
      </Box>

      <Box direction="row" wrap justify="center">
        {filteredWorks.map((work) => (
          <Box
            key={work._id}
            width="medium"
            pad="medium"
            // hoverIndicator="light-1"
            onClick={() =>
              history.push(`/${work.authorUsername}/work/${work._id}`)
            }
          >
            <Box>
              <Box pad={{ bottom: 'medium' }}>
                <Text weight={600} size="large">
                  {work.title}
                </Text>
                <Box direction="row">
                  <Box flex={{ grow: 1 }}>
                    <Text weight={300}>{work.shortDescription}</Text>
                    <Box flex={{ grow: 0 }}>
                      {work.category && <Tag label={work.category} />}
                    </Box>
                  </Box>
                  <Avatar flex={{ grow: 0 }} />
                </Box>
              </Box>

              <Box>
                <LazyLoadImage
                  alt={work.title}
                  src={work.images && work.images[0]}
                  style={imageStyle}
                  effect="black-and-white"
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Works;
