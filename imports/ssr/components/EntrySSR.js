import React from 'react';
import { Badge, Box, Center, ChakraProvider, Flex, Heading, Img } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';

import { generateTheme } from '../../ui/utils/constants/theme';

export default function EntrySSR({ description, host, imageUrl, subTitle, title, children }) {
  const hue = host?.settings?.hue;
  const chakraTheme = generateTheme(hue || '233');

  return (
    <ChakraProvider theme={chakraTheme}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={subTitle?.substring(0, 150)} />
        <meta property="og:title" content={title?.substring(0, 30)} />
        <meta property="og:description" content={subTitle?.substring(0, 60)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={host.host} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {children}

      <Headings title={title} subTitle={subTitle} />

      <Center>{imageUrl && <Img src={imageUrl} h={400} />}</Center>

      <Center p={12}>
        {description && (
          <Box fontFamily="'Helvetica', sans-serif" fontWeight={400} lineHeight={1.4} w={400}>
            {renderHTML(description)}
          </Box>
        )}
      </Center>
    </ChakraProvider>
  );
}

function Headings({ title, subTitle, tags }) {
  return (
    <Center px="2" mb="6">
      <Box>
        <Heading
          as="h1"
          lineHeight={1}
          my="2"
          size="lg"
          textAlign="center"
          textShadow="1px 1px 1px #fff"
        >
          {title}
        </Heading>
        {subTitle && (
          <Heading as="h2" size="md" fontWeight="400" lineHeight={1} my="2" textAlign="center">
            {subTitle}
          </Heading>
        )}
        {tags && tags.length > 0 && (
          <Flex flexGrow="0" justify="center" mt="4">
            {tags.map(
              (tag) =>
                tag && (
                  <Badge key={tag} bg="gray.50" color="gray.800" fontSize="14px">
                    {tag}
                  </Badge>
                )
            )}
          </Flex>
        )}
      </Box>
    </Center>
  );
}
