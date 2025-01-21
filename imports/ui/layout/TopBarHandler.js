import React from 'react';
import { Box, Flex, Slide } from '@chakra-ui/react';
import UserPopup from '../components/UserPopup';
import FederationIconMenu from './FederationIconMenu';

export default function TopBarHandler({ slideStart }) {
  return (
    <Slide direction="top" in={slideStart} unmountOnExit style={{ zIndex: 1403 }}>
      <Box position="relative">
        <Box bg="brand.50" position="absolute" top="0" w="100%" h="48px" zIndex={0} />
      </Box>
      <Flex justify="space-between" w="100%">
        <Box>
          <FederationIconMenu />
        </Box>
        <Box p="1">
          <UserPopup />
        </Box>
      </Flex>
    </Slide>
  );
}
