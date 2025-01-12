import React from 'react';
import { Avatar, Box, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

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
  if (!title && !imageUrl) {
    return null;
  }

  const remaining = dates?.length - 1;

  return (
    <Box _hover={{ bg: 'brand.50' }} cursor="pointer" borderRadius="8px">
      <Box className="text-link-container" position="relative">
        <Center
          bg={imageUrl ? 'none' : 'brand.100'}
          h={fixedImageHeight ? '180px' : 'auto'}
          overflow="hidden"
        >
          {imageUrl ? (
            <LazyLoadImage
              alt={title}
              effect="black-and-white"
              fit={fixedImageHeight ? 'cover' : 'contain'}
              src={imageUrl}
              style={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                margin: '0 auto',
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
        {host && (
          <Box position="absolute" top="0" right="0" pl="1" pb="1" bg="rgba(255, 255, 255, 0.4)">
            <Tag border="none" label={host} />
          </Box>
        )}

        <Flex align="flex-start" justify="space-between" py="2" px="4">
          <Box pb="2" pr="3">
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
                  <DateJust>{date?.startDate}</DateJust>
                  {date?.startDate !== date?.endDate && '-'}
                  {date?.startDate !== date?.endDate && <DateJust>{date?.endDate}</DateJust>}
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
