import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, Image } from '@chakra-ui/react';

import HeaderMenu from './HeaderMenu';
import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';

function Header() {
  const { currentHost, currentUser, isDesktop } = useContext(StateContext);

  return (
    <Box mb="4" py="2" w="100%">
      <Flex w="100%" align="flex-start">
        <Box w="56px" />
        <Center w="100%" flexDirection="column" mb="2">
          <Box>
            <Link to="/">
              <Box w="120px" h="60px" my="2">
                <Image fit="contain" src={currentHost && currentHost.logo} />
              </Box>
            </Link>
          </Box>
          <HeaderMenu currentHost={currentHost} isDesktop={isDesktop} />
        </Center>

        <Flex justify="flex-end">
          <UserPopup currentUser={currentUser} />
        </Flex>
      </Flex>
    </Box>
  );
}

export default Header;
