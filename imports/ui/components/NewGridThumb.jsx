import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import i18n from 'i18next';
import moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';

moment.locale(i18n.language);

export default function GridThumb({ title, imageUrl, subTitle }) {
  if (!title || !imageUrl) {
    return null;
  }

  return (
    <Box m="8" mb="150px">
      <LazyLoadImage
        alt={title}
        effect="blur"
        fit="contain"
        src={imageUrl}
        style={{
          height: 300,
          marginBottom: 12,
        }}
      />
      <Box maxW={300}>
        <Heading fontSize="xl" fontWeight="light" mb="2">
          {title}
        </Heading>
        <Heading fontSize="md" fontWeight="light">
          <em>{subTitle}</em>
        </Heading>
      </Box>
    </Box>
  );
}
