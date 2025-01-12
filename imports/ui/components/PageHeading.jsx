import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Center, Heading, Divider } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

export default function PageHeading({ description, heading, children }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <Helmet>
        <title>{heading}</title>
      </Helmet>
      <Center>
        <Box>
          <Center wrap="wrap">
            <Heading as="h1" size="lg" textAlign="center">
              {heading}
            </Heading>
          </Center>
          <Box py="2">
            <Divider borderColor="brand.500" minW="280px" />
            <Center>{children}</Center>
            <Heading
              as="h2"
              fontFamily="'Sarabun', sans-serif"
              fontSize="1.17em"
              fontWeight="300"
              lineHeight="1.3"
              maxW="520px"
              my="2"
              textAlign="center"
            >
              {description}
            </Heading>
          </Box>
        </Box>
      </Center>
    </>
  );
}
