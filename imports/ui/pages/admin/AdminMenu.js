import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Eye from 'lucide-react/dist/esm/icons/eye';

import {
  Avatar,
  Box,
  Code,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from '/imports/ui/core';
import { StateContext } from '/imports/ui/LayoutContainer';
import { getFullName } from '/imports/ui/utils/shared';

export function AdminMenuHeader({ currentHost }) {
  return (
    <Link to="/" style={{ width: '100%' }}>
      <Box
        bg="white"
        px="4"
        py="2"
        css={{
          ':hover': {
            backgroundColor: 'var(--cocoso-colors-bluegray-200)',
          },
          ':focus': {
            backgroundColor: 'var(--cocoso-colors-bluegray-300)',
          },
        }}
      >
        <Flex
          align="center"
          css={{ color: 'var(--cocoso-colors-bluegray-900)' }}
        >
          <Eye />
          <Text color="bluegray.900" fontWeight="bold" fontSize="lg">
            {currentHost.settings?.name}
          </Text>
        </Flex>
        <Code bg="bluegray.50" color="bluegray.900" fontSize="xs">
          {currentHost.host}
        </Code>
      </Box>
    </Link>
  );
}

export function AdminUserThumb({ currentUser }) {
  const location = useLocation();

  if (!currentUser) {
    return null;
  }

  const isCurrentRoute = location?.pathname?.includes('my-profile');

  return (
    <Box
      bg={isCurrentRoute ? 'bluegray.900' : 'bluegray.700'}
      p="4"
      css={{
        ':hover': {
          backgroundColor: 'var(--cocoso-colors-bluegray-800)',
        },
      }}
    >
      <Flex align="center">
        <Avatar
          size="lg"
          src={currentUser.avatar && currentUser.avatar.src}
          css={{
            backgroundColor: 'var(--cocoso-colors-theme-100)',
            borderRadius: 'var(--cocoso-border-radius)',
            ':hover': {
              backgroundColor: 'var(--cocoso-colors-theme-200)',
            },
          }}
        />

        <Box p="2">
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {currentUser.username}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="light" color="white">
              {getFullName(currentUser)}
            </Text>
          </Box>
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
  const isCurrentRoute = pathname.includes(
    isSub ? itemSplitted[1] : itemSplitted[0]
  );

  if (isSub && !pathname.includes(parentValue)) {
    return null;
  }

  return (
    <Box
      cursor="pointer"
      p="2.5"
      css={{
        borderRightColor: 'var(--cocoso-colors-bluegray-500)',
        borderRightStyle: 'solid',
        borderRightWidth: isCurrentRoute && !item.isMulti ? '3px' : '0',
        marginLeft: isSub ? '1rem' : '0',
        ':hover': {
          backgroundColor: 'var(--cocoso-colors-bluegray-100)',
        },
      }}
      onClick={() => onItemClick(item)}
    >
      <Text
        fontWeight={isCurrentRoute ? 'bold' : 'normal'}
        css={{
          color: 'var(--cocoso-colors-bluegray-800)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {item.label}
      </Text>
    </Box>
  );
}

export default function AdminMenu({ routes, onItemClick }) {
  const { currentHost, currentUser, isDesktop, role } =
    useContext(StateContext);
  const [t] = useTranslation('admin');

  const isAdmin = role === 'admin';

  if (!currentHost || !currentUser) {
    return null;
  }

  // const { isPortalHost } = currentHost;
  // const { isSuperAdmin } = currentUser;

  return (
    <Flex
      bg="bluegray.50"
      h={isDesktop ? '100%' : 'calc(100% - 60px)'}
      w={isDesktop ? '320px' : '100%'}
      css={{
        position: 'fixed',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      {isDesktop && <AdminMenuHeader currentHost={currentHost} />}

      <Flex
        direction="column"
        justifyContent="space-between"
        h="100%"
        w="100%"
        css={{ overflowY: 'auto' }}
      >
        {isDesktop && isAdmin && (
          <Heading
            p="2"
            css={{
              color: 'var(--cocoso-colors-bluegray-800)',
              flexGrow: '0',
              fontSize: '1.25rem',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {t('panel')}
          </Heading>
        )}

        <Box h="100%" p="4" w="100%" css={{ flexGrow: '1', overflowY: 'auto' }}>
          <List w="100%">
            {routes?.map((item) => (
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

        <Box
          w="100%"
          css={{
            cursor: 'pointer',
            flexGrow: '0',
          }}
          onClick={() =>
            onItemClick({
              label: 'My Profile',
              value: '/admin/my-profile',
            })
          }
        >
          <AdminUserThumb currentUser={currentUser} />
        </Box>
      </Flex>
    </Flex>
  );
}
