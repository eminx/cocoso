import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useAtomValue } from 'jotai';

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

import { allHostsAtom } from '../../state';
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

function NewGridThumb({
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
  const allHosts = isClient && useAtomValue(allHostsAtom);

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
        '&:hover': { bg: 'theme.50' },
      }}
    >
      <Box
        className="text-link-container"
        css={{
          borderRadius: 'var(--cocoso-border-radius)',
        }}
      >
        <Center
          bg={imageUrl ? 'white' : 'theme.100'}
          h={fixedImageHeight ? '220px' : 'auto'}
          css={{
            overflow: 'hidden',
            position: 'relative',
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
              <Text
                css={{
                  color: 'var(--cocoso-colors-theme-600)',
                  fontSize: '2rem',
                  fontWeight: 'light',
                  margin: '1rem',
                }}
              >
                {coverText}
              </Text>
            )
          )}

          {host && (
            <Box
              p="2"
              css={{
                position: 'absolute',
                right: '0',
                bottom: '8px',
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
        </Center>

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
          <Box pb="2" pr="3">
            <Heading
              className="text-link"
              truncated
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
                truncated
                css={{
                  fontSize: '1rem',
                  fontWeight: 'light',
                  marginBottom: '0.5rem',
                  overflowWrap: 'anywhere',
                }}
              >
                {subTitle}
              </Heading>
            )}
            {tag && <Tag filterColor={color} label={tag} />}
          </Box>

          {avatar && (
            <Box pt="2">
              <Avatar name={avatar.name} size="md" src={avatar.url} />
            </Box>
          )}
        </Flex>
        {footer}
      </Box>
    </Box>
  );
}

export default memo(NewGridThumb);
