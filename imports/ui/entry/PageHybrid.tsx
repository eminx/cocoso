import React from 'react';
import { Helmet } from 'react-helmet';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

import { Box, Center, Heading } from '/imports/ui/core';

import NiceSlider from '../generic/NiceSlider';
import { parseTitle } from '../../api/_utils/shared';

interface SimplePageProps {
  description?: string;
  images?: string[];
  imageUrl?: string;
  title?: string;
  url?: string;
}

function SimplePage({
  description,
  images,
  imageUrl,
  title,
  url,
}: SimplePageProps) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title?.substring(0, 40)} />
        <meta property="og:image" content={images && images[0]} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:description"
          content={description?.substring(0, 150)}
        />
        <meta property="og:type" content="article" />
      </Helmet>

      <Center>
        <Heading css={{ margin: '1rem 0.5rem 0' }} size="lg" textAlign="center">
          {title}
        </Heading>
      </Center>

      {images && (
        <Center pt="4" pb="2" mb="0">
          <NiceSlider alt={title} images={images} />
        </Center>
      )}

      {description && (
        <Center>
          <Box
            bg="white"
            className="text-content"
            mt="2"
            mb="24"
            p="6"
            css={{ maxWidth: '540px' }}
          >
            {description && HTMLReactParser(DOMPurify.sanitize(description))}
          </Box>
        </Center>
      )}
    </>
  );
}

interface Page {
  _id: string;
  title?: string;
  longDescription?: string;
  imageUrl?: string;
  images?: string[];
  host?: string;
}

export interface PageHybridProps {
  currentPage: Page;
}

export default function PageHybrid({ currentPage }: PageHybridProps) {
  if (!currentPage) {
    return null;
  }

  const url = `${currentPage.host}/${parseTitle(currentPage.title)}`;

  return (
    <SimplePage
      description={currentPage.longDescription}
      images={currentPage.images}
      title={currentPage.title}
      url={url}
      imageUrl={currentPage.images?.[0]}
    />
  );
}
