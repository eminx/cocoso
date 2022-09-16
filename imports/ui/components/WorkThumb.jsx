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
    <Box bg="gray.50" borderRadius={3} px="4" py="2" boxShadow="0 0 2px 0 rgba(120, 120, 120, 0.5)">
      <Flex align="center" justify="space-between" mb="2">
        <Box pr="2">
          <Heading my="2" size="md" noOfLines={1}>
            {work.title}
          </Heading>
          {work.category && (
            <Tag filterColor={work.categoryColor} label={work.category.label} mb="1" />
          )}
        </Box>
        <Avatar name={work.authorUsername} src={work.authorAvatar} />
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
