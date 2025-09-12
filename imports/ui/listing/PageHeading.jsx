import React from 'react';
import { Helmet } from 'react-helmet';
import { Client } from 'react-hydration-provider';

import { Box, Center, Divider, Heading, Text } from '/imports/ui/core';

import NewButton from './NewButton';

export default function PageHeading({
  description,
  heading,
  imageUrl,
  url,
  children,
}) {
  return (
    <>
      <Helmet>
        <title>{heading}</title>
        <meta charSet="utf-8" />
        <meta name="title" content={heading} />
        <meta name="description" content={description} />
        <meta property="og:title" content={heading?.substring(0, 40)} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:description"
          content={description?.substring(0, 150)}
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
            <Center>{children}</Center>
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
