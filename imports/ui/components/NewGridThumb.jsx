import React, { useContext } from 'react';
import { Avatar, Box, Center, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import { StateContext } from '../LayoutContainer';
import { DateJust } from './FancyDate';
import Tag from './Tag';

export default function NewGridThumb({
  avatar,
  color,
  coverText,
  dates,
  fixedImageHeight = false,
  footer = null,
  host,
  imageUrl,
  subTitle,
  title,
  tag,
}) {
  const { currentHost } = useContext(StateContext);

  if (!title && !imageUrl) {
    return null;
  }

  const remaining = dates?.length - 1;

  return (
    <Box cursor="pointer" w={fixedImageHeight ? '2xs' : 'auto'}>
      <Box className="text-link-container" position="relative">
        <Center bg={'brand.100'} h={fixedImageHeight ? '120px' : 'auto'} overflow="hidden">
          {imageUrl ? (
            <LazyLoadImage
              alt={title}
              effect="black-and-white"
              fit={fixedImageHeight ? 'cover' : 'contain'}
              src={imageUrl}
              style={{
                position: 'relative',
              }}
            />
          ) : (
            coverText && (
              <Text color="brand.600" fontSize="3xl" fontWeight="light" m="4">
                {coverText}
              </Text>
            )
          )}
        </Center>
        {host && currentHost.isPortalHost && (
          <Box position="absolute" top="0" right="0" pl="1" pb="1" bg="rgba(255, 255, 255, 0.4)">
            <Tag border="none" label={host} />
          </Box>
        )}

        <Flex align="flex-start" bg="white" justify="space-between" py="2" px="4">
          <Box color="gray.900" pb="2" pr="3">
            <Heading
              className="text-link"
              fontFamily="'Raleway', sans-serif"
              fontSize="1.2rem"
              fontWeight="bold"
              mb="1"
              mt="2"
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
            {tag && <Tag filterColor={color} label={tag} />}
          </Box>

          {avatar && (
            <Box pt="2">
              <Avatar borderRadius="8px" name={avatar.name} src={avatar.url} />
            </Box>
          )}

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
        {footer}
      </Box>
    </Box>
  );
}
