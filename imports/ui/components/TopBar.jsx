import React, { useContext } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';
import { useTranslation } from 'react-i18next';

export default function TopBar() {
  const { currentUser, isDesktop, platform } = useContext(StateContext);
  const [t] = useTranslation('members');

  return (
    <Box bg="brand.800" zIndex="1405" position="relative">
      <Flex justify="space-between">
        <Box w={isDesktop ? '72px' : '48px'}>
          <Center>
            <Text color="brand.50" fontSize={isDesktop ? '36px' : '28px'} fontWeight="bold">
              {platform?.name?.substring(0, 1)?.toUpperCase()}
            </Text>
          </Center>
        </Box>

        <Flex align="center">
          {currentUser && (
            <Box py="1">
              <Menu placement="bottom-end">
                <MenuButton>
                  <Button
                    color="brand.50"
                    fontWeight="normal"
                    mt="1"
                    rightIcon={<ChevronDownIcon />}
                    size={isDesktop ? 'md' : 'sm'}
                    variant="ghost"
                  >
                    {t('profile.myCommunities')}
                  </Button>
                </MenuButton>
                <MenuList zIndex="1405">
                  {currentUser.memberships.map((m) => (
                    <MenuItem key={m.host} onClick={() => (window.location = `https://${m.host}`)}>
                      {m.hostname}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          )}

          <Box pr="18px" py="1" zIndex="1403">
            <UserPopup />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
