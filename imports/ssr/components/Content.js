import React from 'react';
import { Box, Center, Img } from '@chakra-ui/react';
import renderHTML from 'react-render-html';

const h1Style = {
  fontFamily: "'Helvetica', sans-serif",
  marginBottom: 12,
  fontSize: 24,
};

const h3Style = {
  fontFamily: "'Helvetica', sans-serif",
  marginTop: 0,
  fontSize: 18,
  fontWeight: 400,
};

export default function Content({ title, subTitle, imageUrl, description }) {
  return (
    <>
      <Center>
        <h1 style={h1Style}>{title}</h1>
      </Center>

      <Center>{subTitle && <h3 style={h3Style}>{subTitle}</h3>}</Center>

      <Center>{imageUrl && <Img src={imageUrl} h={400} />}</Center>

      <Center>
        {description && (
          <Box w={400} fontFamily="'Helvetica', sans-serif" fontWeight={400} lineHeight={1.4}>
            {renderHTML(description)}
          </Box>
        )}
      </Center>
    </>
  );
}
