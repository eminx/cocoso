import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, Heading, Image } from '@chakra-ui/react';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import HeaderMenu from './HeaderMenu';

function Header() {
  const { canCreateContent, currentHost, currentUser, isDesktop } = useContext(StateContext);

  return (
    <Box p="2" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Flex align={isDesktop ? 'flex-end' : 'flex-start'}>
          <Box>
            <Link to="/">
              <Box maxHeight="80px" mr="4">
                <Image fit="contain" maxHeight="80px" src={currentHost && currentHost.logo} />
              </Box>
            </Link>
          </Box>
          <Box>
            <Heading size="lg" fontWeight="normal" textAlign={isDesktop ? 'left' : 'center'}>
              {currentHost?.settings?.name}
            </Heading>
            {currentHost?.settings?.subname && currentHost?.settings?.subname.length > 0 && (
              <Heading fontSize="md" fontWeight="light" textAlign={isDesktop ? 'left' : 'center'}>
                {currentHost.settings.subname}
              </Heading>
            )}
          </Box>
        </Flex>

        <Flex justify="flex-end" zIndex="1402">
          <UserPopup currentUser={currentUser} />
        </Flex>
      </Flex>
      <Center my="12">
        <HeaderMenu
          canCreateContent={canCreateContent}
          currentHost={currentHost}
          isDesktop={isDesktop}
        />
      </Center>
    </Box>
  );
}

export default Header;
