import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Center, Heading, Divider } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

export default function PageHeading({ description, heading, children }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <Helmet data-oid="l2-orzd">
        <title data-oid="_pf9iqe">{heading}</title>
        <meta charSet="utf-8" data-oid="13s219o" />
        <meta name="title" content={heading} data-oid="3cvhueo" />
        <meta name="description" content={description?.substring(0, 150)} data-oid="jgvpm:6" />
        <meta property="og:title" content={heading} data-oid="30xiufw" />
        <meta property="og:description" content={description} data-oid="8h_.3tm" />
        <meta property="og:type" content="article" data-oid="kc-k4n0" />
      </Helmet>
      <Center mb="4" data-oid="p_mct0o">
        <Box data-oid="rdn8-ga">
          <Center wrap="wrap" data-oid="hoxj3.r">
            <Heading as="h1" size="lg" textAlign="center" data-oid="di2gqfe">
              {heading}
            </Heading>
          </Center>
          <Box py="2" data-oid="d57_4pm">
            <Divider borderColor="brand.500" minW="280px" data-oid="0ieq50s" />
            <Center data-oid="59jn:d5">{children}</Center>
            <Heading
              as="h2"
              fontFamily="'Sarabun', sans-serif"
              fontSize="1.17em"
              fontWeight="300"
              lineHeight="1.3"
              maxW="520px"
              my="2"
              textAlign="center"
              data-oid="xbf08h1"
            >
              {description}
            </Heading>
          </Box>
        </Box>
      </Center>
    </>
  );
}
