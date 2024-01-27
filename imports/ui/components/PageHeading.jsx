import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Center, Heading, Divider } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';

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
            <Heading as="h1" fontFamily="'Raleway', sans-serif" size="lg" textAlign="center">
              {heading || activeMenuItem?.label}
            </Heading>
          </Center>
          <Box pt="2" pb="2">
            <Divider borderColor="gray.500" />
            {/* <Center>{children}</Center> */}
            <Heading
              as="h2"
              size="sm"
              fontWeight="normal"
              lineHeight="1.5"
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
