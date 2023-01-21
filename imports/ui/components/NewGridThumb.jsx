import React, { useContext } from 'react';
import { Avatar, Box, Code, Flex, Heading, Tag as CTag, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { StateContext } from '../LayoutContainer';
import { DateJust } from './FancyDate';
import Tag from './Tag';

export default function GridThumb({ avatar, color, dates, imageUrl, subTitle, title, tag }) {
  const { currentHost } = useContext(StateContext);

  if (!title || !imageUrl) {
    return null;
  }

  return (
    <Box m="6" mb="40px">
      <Box className="text-link-container">
        <LazyLoadImage
          alt={title}
          effect="blur"
          fit="contain"
          src={imageUrl}
          style={{
            maxHeight: 300,
            marginBottom: 6,
          }}
        />
        <Flex align="flex-start" justify="space-between" mb="2">
          <Box pr="2" maxW={300}>
            <Heading className="text-link" fontSize="1.4rem" fontWeight="light" mb="1">
              {title}
            </Heading>
            {subTitle && (
              <Heading className="text-link" fontSize="md" fontWeight="light">
                {subTitle}
              </Heading>
            )}
            {tag && <Tag filterColor={color} label={tag} my="1" />}
            {currentHost.isPortalHost && (
              <Flex justify="flex-start">
                <CTag border="1px solid #2d2d2d" my="2">
                  {currentHost.host}
                </CTag>
              </Flex>
            )}
          </Box>
          {avatar && <Avatar name={avatar.name} src={avatar.url} />}
          {dates && (
            <Flex color="gray.800" fontWeight="light">
              <DateJust style={{ color: '##2d2d2d' }}>{dates[0]}</DateJust>
              {dates.length > 1 && (
                <Text fontSize="xl" ml="2" wordBreak="keep-all">
                  {' '}
                  +{dates.length - 1}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
