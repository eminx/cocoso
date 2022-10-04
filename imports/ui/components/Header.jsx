import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, Heading, Image } from '@chakra-ui/react';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import HeaderMenu from './HeaderMenu';

function Header() {
  const { canCreateContent, currentHost, currentUser, isDesktop } = useContext(StateContext);
  const logo = useRef(null);
  const [popupWidth, setPopupWidth] = useState();
  useEffect(() => {
    setTimeout(() => {
      const rect = logo.current.getBoundingClientRect();
      setPopupWidth(parseInt(rect.width));
    }, 200);
  }, []);

  return (
    <Box p="4" w="100%">
      <Flex w="100%" align="flex-start" justify="space-between">
        <Flex align={isDesktop ? 'flex-end' : 'flex-start'}>
          <Box>
            <Link to="/">
              <Box maxHeight="80px">
                <Image
                  ref={logo}
                  fit="contain"
                  maxHeight="80px"
                  src={currentHost && currentHost.logo}
                />
              </Box>
            </Link>
          </Box>
          <Box px="3">
            <Heading
              size={isDesktop ? 'lg' : 'md'}
              fontWeight="normal"
              textAlign={isDesktop ? 'left' : 'center'}
            >
              {currentHost?.settings?.name}
            </Heading>
            {currentHost?.settings?.subname && currentHost?.settings?.subname.length > 0 && (
              <Heading
                size={isDesktop ? 'md' : 'sm'}
                fontWeight="light"
                textAlign={isDesktop ? 'left' : 'center'}
              >
                {currentHost.settings.subname}
              </Heading>
            )}
          </Box>
        </Flex>

        <Flex justify="flex-end" w={popupWidth} zIndex="1402">
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
