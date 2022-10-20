import React from 'react';
import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { DateJust } from './FancyDate';
import Tag from './Tag';

export default function GridThumb({ avatar, dates, imageUrl, subTitle, title, tag }) {
  if (!title || !imageUrl) {
    return null;
  }

  return (
    <Box className="text-link-container" m="6" mb="40px">
      <LazyLoadImage
        alt={title}
        effect="blur"
        fit="contain"
        src={imageUrl}
        style={{
          maxHeight: 300,
          marginBottom: 12,
        }}
      />
      <Flex align="flex-start" justify="space-between" mb="2">
        <Box pr="2" maxW={300}>
          <Heading className="text-link" fontSize="1.4rem" fontWeight="light" mb="2">
            {title}
          </Heading>
          {subTitle && (
            <Heading className="text-link" fontSize="md" fontWeight="light">
              {subTitle}
            </Heading>
          )}
          {tag && <Tag label={tag} mb="1" />}
        </Box>
        {avatar && <Avatar name={avatar.name} src={avatar.url} />}
        {dates && (
          <Flex color="gray.800">
            <DateJust style={{ color: '##2d2d2d' }}>{dates[0]}</DateJust>
            {dates.length > 1 && (
              <Text fontSize="2xl" ml="2">
                {' '}
                + {dates.length - 1}
              </Text>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
