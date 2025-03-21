import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { Avatar, Box, Center, Flex, Heading, Img, Tag as CTag, Text } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { StateContext } from '../LayoutContainer';
import Tag from '../generic/Tag';

const isClient = Meteor.isClient;

if (isClient) {
  import 'react-lazy-load-image-component/src/effects/black-and-white.css';
}

const imageStyle = {
  margin: '0 auto',
  position: 'relative',
  width: '100%',
};

export default function NewGridThumb({
  avatar,
  color,
  coverText,
  fixedImageHeight = false,
  footer = null,
  host,
  index,
  imageUrl,
  subTitle,
  title,
  tag,
}) {
  if (!title && !imageUrl) {
    return null;
  }
  const { allHosts } = isClient && useContext(StateContext);

  const hostValue =
    host && allHosts && isClient ? allHosts?.find((h) => h.host === host)?.name : host;

  return (
    <Box
      _hover={{ bg: 'brand.50' }}
      bg="brand.200"
      border="1px solid white"
      borderRadius="lg"
      cursor="pointer"
    >
      <Box borderRadius="lg" className="text-link-container" position="relative">
        <Center
          bg={imageUrl ? 'white' : 'brand.100'}
          borderTopLeftRadius="8px"
          borderTopRightRadius="8px"
          h={fixedImageHeight ? '220px' : 'auto'}
          overflow="hidden"
        >
          {imageUrl ? (
            index < 8 ? (
              <Img alt={title} src={imageUrl} style={imageStyle} />
            ) : (
              <LazyLoadImage
                alt={title}
                effect="black-and-white"
                fit={fixedImageHeight ? 'cover' : 'contain'}
                src={imageUrl}
                style={imageStyle}
              />
            )
          ) : (
            coverText && (
              <Text color="brand.600" fontSize="3xl" fontWeight="light" m="4">
                {coverText}
              </Text>
            )
          )}
        </Center>

        {host && (
          <Box p="1" position="absolute" right="0" top="0">
            <CTag bg="rgba(0, 0, 0, 0.6)" color="white" size="sm">
              {hostValue}
            </CTag>
          </Box>
        )}

        <Flex
          align="flex-start"
          bg="white"
          borderBottomRadius="8px"
          border="1px solid"
          borderColor="gray.300"
          borderTopWidth="0"
          justify="space-between"
          py="2"
          px="4"
        >
          <Box pb="2" pr="3" isTruncated>
            <Heading
              className="text-link"
              fontFamily="'Raleway', sans-serif"
              fontSize="1.2rem"
              fontWeight="bold"
              isTruncated
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
              <Avatar borderRadius="lg" name={avatar.name} src={avatar.url} />
            </Box>
          )}
        </Flex>
        {footer}
      </Box>
    </Box>
  );
}
