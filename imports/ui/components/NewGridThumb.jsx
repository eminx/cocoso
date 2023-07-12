import React, { useContext } from 'react';
import { Avatar, Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { StateContext } from '../LayoutContainer';
import { DateJust } from './FancyDate';
import Tag from './Tag';

export default function GridThumb({ avatar, color, dates, host, imageUrl, subTitle, title, tag }) {
  const { currentHost, isDesktop } = useContext(StateContext);

  if (!title || !imageUrl) {
    return null;
  }

  const remaining = dates?.length - 1;

  return (
    <Box mb="8" bg="white">
      <Box className="text-link-container" position="relative">
        <Box>
          <LazyLoadImage
            alt={title}
            effect="blur"
            fit="contain"
            src={imageUrl}
            style={{
              position: 'relative',
              objectFit: 'contain',
            }}
          />
        </Box>
        {host && currentHost.isPortalHost && (
          <Box position="absolute" top="0" right="0" pl="1" pb="1" bg="rgba(255, 255, 255, 0.4)">
            <Tag border="none" label={host} />
          </Box>
        )}

        <Flex align="flex-start" justify="space-between" py="2" px="4">
          <Box pr="3">
            <Heading
              className="text-link"
              fontFamily="'Raleway', sans-serif"
              fontSize="1.4rem"
              fontWeight="bold"
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
                mb="2"
                overflowWrap="anywhere"
              >
                {subTitle}
              </Heading>
            )}
            <HStack py="2" spacing="4">
              {tag && <Tag filterColor={color} label={tag} />}
            </HStack>
          </Box>

          {avatar && <Avatar borderRadius="8px" name={avatar.name} src={avatar.url} />}

          {dates && (
            <Flex flexShrink="0">
              {dates.slice(0, 1).map((date) => (
                <Flex key={date?.startDate + date?.startTime}>
                  <DateJust>{date.startDate}</DateJust>
                  {date.startDate !== date.endDate && '-'}
                  {date.startDate !== date.endDate && <DateJust>{date.endDate}</DateJust>}
                </Flex>
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
