import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {
  Avatar,
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Tag as CTag,
  Text,
} from '/imports/ui/core';

import { StateContext } from '../LayoutContainer';
import Tag from '../generic/Tag';
import { m } from 'framer-motion';

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
    host && allHosts && isClient
      ? allHosts?.find((h) => h.host === host)?.name
      : host;

  return (
    <Box
      css={{
        backgroundColor: 'var(--cocoso-colors-theme-200)',
        border: '1px solid white',
        borderRadius: 'var(--cocoso-border-radius)',
        cursor: 'pointer',
        overflow: 'hidden',
        ':hover': { bg: 'brand.50' },
      }}
    >
      <Box
        borderRadius="lg"
        className="text-link-container"
        position="relative"
      >
        <Center
          bg={imageUrl ? 'white' : 'brand.100'}
          h={fixedImageHeight ? '220px' : 'auto'}
          css={{
            overflow: 'hidden',
          }}
        >
          {imageUrl ? (
            index < 8 ? (
              <Image alt={title} src={imageUrl} style={imageStyle} />
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
          <Box
            p="1"
            css={{
              position: 'absolute',
              right: '0',
              top: '0',
            }}
          >
            <CTag
              size="sm"
              css={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
              }}
            >
              {hostValue}
            </CTag>
          </Box>
        )}

        <Flex
          align="flex-start"
          bg="white"
          justify="space-between"
          py="2"
          px="4"
          css={{
            borderBottomLeftRadius: 'var(--cocoso-border-radius)',
            borderBottomRightRadius: 'var(--cocoso-border-radius)',
            border: '1px solid',
            borderColor: 'var(--cocoso-colors-gray-100)',
            borderTopWidth: '0',
          }}
        >
          <Box pb="2" pr="3" isTruncated>
            <Heading
              className="text-link"
              mb="1"
              mt="2"
              css={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: '1.2rem',
                fontWeight: 'bold',
                overflowWrap: 'anywhere',
              }}
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
