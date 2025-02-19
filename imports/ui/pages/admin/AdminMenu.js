import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Code, Flex, Heading, List, ListItem, Text } from '@chakra-ui/react';
import Eye from 'lucide-react/dist/esm/icons/eye';

import { StateContext } from '../../LayoutContainer';
import { getFullName } from '../../utils/shared';

export function AdminMenuHeader({ currentHost }) {
  return (
    <Link to="/">
      <Box _hover={{ bg: 'blueGray.200' }} _focus={{ bg: 'blueGray.300' }} bg="white" px="4" py="2">
        <Flex align="center">
          <Eye />
          <Text fontWeight="bold" fontSize="lg" ml="2" mt="-0.5">
            {currentHost.settings?.name}
          </Text>
        </Flex>
        <Code bg="blueGray.50" color="inherit" fontSize="xs">
          {currentHost.host}
        </Code>
      </Box>
    </Link>
  );
}

export function AdminUserThumb({ currentUser }) {
  if (!currentUser) {
    return null;
  }

  return (
    <Box _hover={{ bg: 'blueGray.800' }} bg="blueGray.700" color="white" p="4">
      <Flex>
        <Avatar
          _hover={{ bg: 'brand.200' }}
          bg="brand.100"
          borderRadius="8px"
          showBorder
          size="lg"
          src={currentUser.avatar && currentUser.avatar.src}
        />

        <Box align="flex-start" textAlign="left" px="3">
          <Text fontSize="lg" fontWeight="bold">
            {currentUser.username}
          </Text>
          <Text fontWeight="light">{getFullName(currentUser)}</Text>
        </Box>
      </Flex>
    </Box>
  );
}

function AdminMenuItem({ item, isSub, parentValue, onItemClick }) {
  if (!item) {
    return null;
  }
  const location = useLocation();
  const pathname = location?.pathname;

  const itemSplitted = item.value.split('/');
  const isCurrentRoute = pathname.includes(isSub ? itemSplitted[1] : itemSplitted[0]);

  if (isSub && !pathname.includes(parentValue)) {
    return null;
  }

  return (
    <Box
      _hover={{ bg: 'blueGray.100' }}
      // bg={isCurrentRoute && !item.isMulti ? 'blueGray.100' : 'inherit'}
      borderRightWidth={isCurrentRoute && !item.isMulti ? '3px' : '0'}
      borderRightColor="blueGray.500"
      cursor="pointer"
      p="2.5"
      ml={isSub ? '4' : '0'}
      onClick={() => onItemClick(item)}
    >
      <Text fontWeight={isCurrentRoute ? 'bold' : 'normal'}>{item.label}</Text>
    </Box>
  );
}

export default function AdminMenu({ routes, onItemClick }) {
  const { currentHost, currentUser, isDesktop, role } = useContext(StateContext);
  const [t] = useTranslation('admin');

  if (!currentHost || !currentUser || role !== 'admin') {
    return null;
  }

  // const { isPortalHost } = currentHost;
  // const { isSuperAdmin } = currentUser;

  return (
    <Flex
      bg="blueGray.50"
      color="blueGray.800"
      direction="column"
      justify="space-between"
      h={isDesktop ? '100%' : 'calc(100% - 60px)'}
      minW="320px"
      position="fixed"
    >
      {isDesktop && <AdminMenuHeader currentHost={currentHost} />}

      <Flex direction="column" h="100%" overflowY="auto">
        {isDesktop && (
          <Heading flexGrow="0" color="blueGray.800" p="4" pb="0" size="md" textAlign="center">
            {t('panel')}
          </Heading>
        )}

        <Box h="100%" flexGrow="1" p="4">
          <List>
            {routes.map((item) => (
              <ListItem key={item.value} p="0">
                <AdminMenuItem item={item} onItemClick={onItemClick} />
                {item.isMulti &&
                  item.content.map((itemSub) => (
                    <AdminMenuItem
                      key={itemSub.value}
                      item={itemSub}
                      isSub
                      parentValue={item.value}
                      onItemClick={onItemClick}
                    />
                  ))}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flexGrow="0">
          <AdminUserThumb currentUser={currentUser} />
        </Box>

        {/* {isSuperAdmin && isPortalHost && platform && (
          <Box mb="2" mt="6">
            <Heading color="blueGray.50" size="sm">
              {`${platform.name} ${tc('domains.platform')}`}
            </Heading>
            <ListMenu list={superadminMenu} />
          </Box>
        )} */}
      </Flex>
    </Flex>
  );
}
