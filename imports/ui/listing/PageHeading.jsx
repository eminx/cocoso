import React from 'react';
import { Helmet } from 'react-helmet';
import { Client } from 'react-hydration-provider';

import { Box, Center, Divider, Heading, Text } from '/imports/ui/core';

import NewButton from './NewButton';

export default function PageHeading({ currentHost, listing }) {
  const listingInMenu = currentHost?.settings?.menu?.find(
    (item) => item.name === listing
  );
  const description = listingInMenu?.description;
  const heading = listingInMenu?.label;
  const url = `${currentHost?.host}/${listingInMenu?.name}`;
  const imageUrl = currentHost?.logo;

  return (
    <>
      <Helmet>
        <title>{String(heading || 'Page')}</title>
        <meta charSet="utf-8" />
        <meta name="title" content={String(heading || 'Page')} />
        <meta name="description" content={String(description || '')} />
        <meta
          property="og:title"
          content={String(heading || 'Page')?.substring(0, 40)}
        />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:description"
          content={String(description || '')?.substring(0, 150)}
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <Center>
        <Box px="2">
          <Center position="relative">
            <Heading as="h1" size="lg" textAlign="center">
              {heading}
            </Heading>
            <Client>
              <NewButton />
            </Client>
          </Center>
          <Box py="2">
            <Divider
              css={{
                borderColor: 'var(--cocoso-colors-theme-500)',
                minWidth: '280px',
              }}
            />
            {description && (
              <Center>
                <Text
                  size="lg"
                  css={{
                    fontWeight: '300',
                    lineHeight: '1.3',
                    maxWidth: '520px',
                    textAlign: 'center',
                  }}
                >
                  {description}
                </Text>
              </Center>
            )}
          </Box>
        </Box>
      </Center>
    </>
  );
}
