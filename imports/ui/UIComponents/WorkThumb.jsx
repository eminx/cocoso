import React from 'react';
import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Tag from './Tag';

const imageStyle = {
  width: '100%',
  height: 220,
  objectFit: 'cover',
};

function WorkThumb({ work }) {
  return (
    <Box bg="rgba(255, 255, 255, .6)" borderRadius={3} p="4">
      <Flex direction="row" justify="space-between" mb="2">
        <div>
          {work.category && (
            <Tag
              label={work.category.label}
              filterColor={work.categoryColor}
              margin={{ bottom: 'xxsmall' }}
            />
          )}
          <Heading my="2" fontWeight="bold" size="md" isTruncated>
            {work.title}
          </Heading>
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
            width="100%"
          />
        </Box>
      )}
      <Box p="1">
        <Text fontWeight="light">{work.shortDescription}</Text>
      </Box>
    </Box>
  );
}

export default WorkThumb;
