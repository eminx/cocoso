import React from 'react';
import { Box, Center, Img } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';

const h1Style = {
  fontFamily: "'Helvetica', sans-serif",
  marginBottom: 12,
  fontSize: 28,
};

const h3Style = {
  fontFamily: "'Helvetica', sans-serif",
  marginTop: 0,
  fontSize: 18,
  fontWeight: 300,
};

export default function Content({ description, host, imageUrl, subTitle, title }) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description?.substring(0, 150)} />
        <meta property="og:title" content={description?.substring(0, 30)} />
        <meta property="og:description" content={description?.substring(0, 60)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={host.host} />
      </Helmet>

      <Center>
        <h1 style={h1Style}>{title}</h1>
      </Center>

      <Center>{subTitle && <h3 style={h3Style}>{subTitle}</h3>}</Center>

      <Center>{imageUrl && <Img src={imageUrl} h={400} />}</Center>

      <Center p={12}>
        {description && (
          <Box fontFamily="'Helvetica', sans-serif" fontWeight={400} lineHeight={1.4} w={400}>
            {renderHTML(description)}
          </Box>
        )}
      </Center>
    </>
  );
}
