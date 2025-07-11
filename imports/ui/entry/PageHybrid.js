import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HTMLReactParser from 'html-react-parser';

import { Box, Center, Heading } from '/imports/ui/core';
import NiceSlider from '../generic/NiceSlider';
import { parseTitle } from '../utils/shared';

function SimplePage({ description, images, imageUrl, title, url }) {
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
        <Heading css={{ margin: '1rem 0.5rem 0.5rem' }} size="lg">
          {title}
        </Heading>
      </Center>

      {images && (
        <Center py="2" mb="0">
          <NiceSlider alt={title} images={images} />
        </Center>
      )}

      {description && (
        <Center>
          <Box
            bg="white"
            className="text-content"
            maxW="540px"
            mt="2"
            mb="24"
            p="6"
          >
            {description && HTMLReactParser(description)}
          </Box>
        </Center>
      )}
    </>
  );
}

export default function PageHybrid({ pages }) {
  const { pageTitle } = useParams();
  const navigate = useNavigate();
  const currentPage = pages.find(
    (page) => parseTitle(page.title) === pageTitle
  );

  if (!pages || pages.length === 0) {
    return null;
  }

  const firstPage = `/info/${parseTitle(pages[0]?.title)}`;

  if (!currentPage) {
    navigate(firstPage);
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
