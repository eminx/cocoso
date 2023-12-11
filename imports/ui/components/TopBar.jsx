import React from 'react';
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

export default function TopBar({ platform, currentUser }) {
  return (
    <Box bg="brand.800" zIndex="1405" position="relative">
      <Flex justify="space-between">
        <Box w="72px">
          <Center>
            <Text color="brand.50" fontSize="36px" fontWeight="bold">
              {platform?.name?.substring(0, 1)?.toUpperCase()}
            </Text>
          </Center>
        </Box>

        <Flex>
          {currentUser && (
            <Box py="1">
              <Menu placement="bottom-end">
                <MenuButton>
                  <Button color="brand.50" rightIcon={<ChevronDownIcon />} variant="ghost" mt="1">
                    My Communities
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

          <Box px="4" py="1" zIndex="1403">
            <UserPopup />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
