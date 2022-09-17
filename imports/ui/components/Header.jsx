import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, Image } from '@chakra-ui/react';

import HeaderMenu from './HeaderMenu';
import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';

function Header() {
  const { currentHost, currentUser, isDesktop } = useContext(StateContext);

  return (
    <Box py="2" w="100%">
      <Flex w="100%" align="flex-start">
        <Box w="56px" />
        <Center w="100%" flexDirection="column" mb="2">
          <Box>
            <Link to="/">
              <Box maxHeight="80px" mt="1" w="220px">
                <Image
                  fit="contain"
                  margin="0 auto"
                  maxHeight="80px"
                  src={currentHost && currentHost.logo}
                />
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
