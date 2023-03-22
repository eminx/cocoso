import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useImageSize } from 'react-image-size';

import { StateContext } from '../LayoutContainer';
import { DateJust } from './FancyDate';
import Tag from './Tag';

const imageHeight = 280;

export default function GridThumb({ avatar, color, dates, host, imageUrl, subTitle, title, tag }) {
  const [dimensions, { loading, error }] = useImageSize(imageUrl);
  const { currentHost } = useContext(StateContext);

  useEffect(() => {}, []);

  if (!title || !imageUrl) {
    return null;
  }

  const remaining = dates?.length - 1;

  const width = dimensions ? (dimensions.width * imageHeight) / dimensions.height : imageHeight;

  return (
    <Box my="4" mx="5">
      <Box className="text-link-container" position="relative" maxWidth={width}>
        <LazyLoadImage
          alt={title}
          effect="blur"
          fit="contain"
          src={imageUrl}
          style={{
            position: 'relative',
            maxHeight: imageHeight,
            marginBottom: 6,
          }}
        />
        {host && currentHost.isPortalHost && (
          <Box position="absolute" top="0" right="0" pl="2" pb="2" bg="white">
            <Tag border="1px solid #2d2d2d" label={host} />
          </Box>
        )}
        <Flex align="flex-start" justify="space-between">
          <Box pr="3">
            <Heading
              className="text-link"
              fontSize="1.3rem"
              fontWeight="light"
              mb="1"
              overflowWrap="anywhere"
            >
              {title}
            </Heading>
            {subTitle && (
              <Heading
                className="text-link"
                fontSize="1rem"
                fontWeight="light"
                overflowWrap="anywhere"
              >
                {subTitle}
              </Heading>
            )}
            <HStack py="2" spacing="4">
              {tag && <Tag filterColor={color} label={tag} />}
            </HStack>
          </Box>
          {avatar && <Avatar name={avatar.name} src={avatar.url} />}
          {dates && (
            <Flex flexShrink="0">
              {dates.slice(0, 1).map((date) => (
                <DateJust key={date?.startDate + date?.startTime} date={date}>
                  {date}
                </DateJust>
              ))}
              {remaining > 0 && (
                <Text fontSize="xl" ml="2" wordBreak="keep-all">
                  + {remaining}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
