import React from 'react';
import { Box, Text } from 'grommet';
import { Avatar } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Tag from './Tag';

const imageStyle = {
  width: '100%',
  height: 220,
  objectFit: 'cover',
};

const ellipsisStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

function WorkThumb({ work, history }) {
  return (
    <Box
      key={work._id}
      onClick={() => history.push(`/${work.authorUsername}/work/${work._id}`)}
      basis="360px"
      margin="small"
      round="3px"
      hoverIndicator="brand-light"
      style={{ background: 'rgba(255, 255, 255, .6)' }}
    >
      <Box pad="small" direction="row" justify="between">
        <Box>
          {work.category && (
            <Tag
              label={work.category.label}
              background={work.category.color}
              margin={{ bottom: 'xxsmall' }}
            />
          )}
          <Text weight={600} style={ellipsisStyle} size="large">
            {work.title}
          </Text>
        </Box>
        <Avatar
          flex={{ grow: 0 }}
          src={work.authorAvatar && work.authorAvatar.src}
        />
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
      <Box pad="small">
        <Text weight={300} style={ellipsisStyle}>
          {work.shortDescription}
        </Text>
      </Box>
    </Box>
  );
}

export default WorkThumb;
