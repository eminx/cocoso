import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import UserPopup from './UserPopup';
import { StateContext } from '../LayoutContainer';

export default function TopBar() {
  const { currentUser, currentHost, isDesktop, platform } = useContext(StateContext);
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');
  const history = useHistory();

  const { isPortalHost } = currentHost;

  return (
    <Box bg="black" zIndex="1405" position="relative">
      <Flex justify="space-between">
        <Box
          _hover={{ bg: 'brand.100', color: 'brand.600' }}
          color="brand.50"
          cursor={isPortalHost ? 'auto' : 'pointer'}
          w={isDesktop ? '72px' : '48px'}
          onClick={isPortalHost ? null : () => (window.location = `https://${platform.portalHost}`)}
        >
          <Center>
            <Text fontSize={isDesktop ? '36px' : '28px'} fontWeight="bold">
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
                  {currentUser?.memberships?.map((m) => (
                    <MenuItem key={m.host} onClick={() => (location.href = `https://${m.host}`)}>
                      {m.hostname}
                    </MenuItem>
                  ))}
                  <Divider colorScheme="gray.700" mt="2" />
                  <MenuItem
                    key="all-communities"
                    onClick={() =>
                      currentHost?.isPortalHost
                        ? history.push('/communities')
                        : (location.href = `https://${platform?.portalHost}/communities`)
                    }
                  >
                    {tc('labels.allCommunities')}
                  </MenuItem>
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
