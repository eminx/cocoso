import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Center, Heading } from '@chakra-ui/react';
import parseHtml from 'html-react-parser';
import { Helmet } from 'react-helmet';
import NiceSlider from '../generic/NiceSlider';

import { parseTitle } from '../utils/shared';

function SimplePage({ description, images, title }) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={images && images[0]} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Center>
        <Heading as="h1" color="gray.800" mb="6" mt="4" size="lg">
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
          <Box bg="white" className="text-content" maxW="540px" mt="2" mb="24" p="6">
            {description && parseHtml(description)}
          </Box>
        </Center>
      )}
    </>
  );
}

export default function PageHybrid({ pages }) {
  const { pageTitle } = useParams();
  const navigate = useNavigate();
  const currentPage = pages.find((page) => parseTitle(page.title) === pageTitle);

  if (!pages || pages.length === 0) {
    return null;
  }

  if (!currentPage) {
    navigate(`/info/${parseTitle(pages[0].title)}`);
    return null;
  }

  return (
    <SimplePage
      description={currentPage.longDescription}
      images={currentPage.images}
      title={currentPage.title}
    />
  );
}
