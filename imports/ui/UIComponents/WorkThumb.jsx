import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  others,
  Text,
} from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Tag from './Tag';

const imageStyle = {
  width: '100%',
  height: 220,
  objectFit: 'cover',
};

function WorkThumb({ work }) {
  return (
    <Box bg="rgba(255, 255, 255, .6)" borderRadius={3} px="4" py="2">
      <Flex align="center" justify="space-between" mb="2">
        <Box>
          <Heading my="2" fontWeight="bold" size="md" isTruncated>
            {work.title}
          </Heading>
          {work.category && (
            <Tag
              filterColor={work.categoryColor}
              label={work.category.label}
              mb="1"
            />
          )}
        </Box>
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
