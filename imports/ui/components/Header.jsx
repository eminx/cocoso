import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, Heading, Image } from '@chakra-ui/react';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import HeaderMenu from './HeaderMenu';

function Header() {
  const { currentHost, currentUser, isDesktop } = useContext(StateContext);

  return (
    <Box p="2" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Flex align="flex-end">
          <Box>
            <Link to="/">
              <Box maxHeight="80px" mr="4">
                <Image fit="contain" maxHeight="80px" src={currentHost && currentHost.logo} />
              </Box>
            </Link>
          </Box>
          <Box>
            <Heading fontSize="28px" fontWeight="normal">
              SKOGEN
            </Heading>
            <Heading fontSize="18px" fontWeight="light">
              Artistrun House for Performing Arts
            </Heading>
          </Box>
        </Flex>

        <Flex justify="flex-end" zIndex="1402">
          <UserPopup currentUser={currentUser} />
        </Flex>
      </Flex>
      <Center my="12">
        <HeaderMenu currentHost={currentHost} isDesktop={isDesktop} />
      </Center>
    </Box>
  );
}

export default Header;
