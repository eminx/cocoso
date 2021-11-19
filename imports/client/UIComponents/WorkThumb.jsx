import React from 'react';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
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
      m="1"
      style={{
        background: 'rgba(255, 255, 255, .6)',
        borderRadius: 3,
        flexBasis: '360px',
      }}
      onClick={() => history.push(`/${work.authorUsername}/work/${work._id}`)}
    >
      <Flex p="1" direction="row" justify="space-between">
        <div>
          {work.category && (
            <Tag
              label={work.category.label}
              filterColor={work.categoryColor}
              margin={{ bottom: 'xxsmall' }}
            />
          )}
          <Text fontWeight="bold" isTruncated fontSize="md">
            {work.title}
          </Text>
        </div>
        <Avatar
          name={work.authorUsername}
          src={work.authorAvatar ? work.authorAvatar.src : null}
        />
      </Flex>
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
      <Box p="1">
        <Text fontWeight="light" isTruncated>
          {work.shortDescription}
        </Text>
      </Box>
    </Box>
  );
}

export default WorkThumb;
