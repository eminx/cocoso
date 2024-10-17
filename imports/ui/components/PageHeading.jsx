import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Center, Heading, Divider } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import NewButton from './NewButton';

export default function PageHeading({ description, heading, children }) {
  const location = useLocation();
  const { currentHost } = useContext(StateContext);

  const pathname = location.pathname;
  const { menu } = currentHost?.settings;

  if (!pathname || !menu) {
    return null;
  }

  const activeMenuItem =
    !heading &&
    menu.find((item) => {
      if (item.name === 'info') {
        return pathname.substring(0, 6) === '/pages';
      }
      return pathname.split('/')?.includes(item.name);
    });

  return (
    <>
      <Center p="4">
        <Box>
          <Center wrap="wrap">
            <Heading as="h1" size="lg" textAlign="center">
              {heading || activeMenuItem?.label}
            </Heading>
            <NewButton />
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
