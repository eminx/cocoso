import React, { useRef, useState } from 'react';
import { Box, Heading, Flex, Image, Text, Spacer } from '@chakra-ui/react';
import i18n from 'i18next';
import moment from 'moment';

moment.locale(i18n.language);

export default function GridThumb({ title, imageUrl, subTitle }) {
  if (!title || !imageUrl) {
    return null;
  }
  const [containerWidth, setContainerWidth] = useState(null);

  const imageContainer = useRef();

  const handleContainerWidth = () => {
    const imageBox = imageContainer?.current?.getBoundingClientRect();
    setContainerWidth(imageBox.width);
  };

  return (
    <Box>
      <Box m="8" h={300} mb="150px" w={containerWidth}>
        <Image
          alt={title}
          h={300}
          fit="contain"
          mb="4"
          ref={imageContainer}
          src={imageUrl}
          onLoad={() => handleContainerWidth()}
        />
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
