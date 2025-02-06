import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, Code, Flex, Heading, List, ListItem, Text } from '@chakra-ui/react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';

import { StateContext } from '../../LayoutContainer';
import { getFullName } from '../../utils/shared';

function AdminMenuItem({ item, isSub, parentValue }) {
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
    <Link to={item.isMulti ? item.content[0].value : item.value}>
      <Box
        _hover={{ bg: 'blueGray.100' }}
        bg={isCurrentRoute && !item.isMulti ? 'blueGray.50' : 'inherit'}
        borderRightWidth={isCurrentRoute && !item.isMulti ? '3px' : '0'}
        borderRightColor="blueGray.500"
        p="3"
        py={isSub || (item.isMulti && isCurrentRoute) ? '2' : '3'}
        ml={isSub ? '4' : '0'}
      >
        <Text
          color={isCurrentRoute ? 'blueGray.800' : 'inherit'}
          fontSize={isSub ? 'sm' : 'md'}
          fontWeight={isCurrentRoute ? 'bold' : 'normal'}
        >
          {item.label}
        </Text>
      </Box>
    </Link>
  );
}

export default function AdminSidebar({ routes }) {
  const { currentHost, currentUser, role } = useContext(StateContext);
  const [t] = useTranslation('admin');

  if (!currentHost || !currentUser || role !== 'admin') {
    return null;
  }

  // const { isPortalHost } = currentHost;
  // const { isSuperAdmin } = currentUser;

  return (
    <Flex
      bg="gray.50"
      color="blueGray.800"
      direction="column"
      justify="space-between"
      h="100vh"
      minW="320px"
      position="fixed"
    >
      <Link to="/">
        <Box bg="gray.100" _hover={{ bg: 'gray.200' }} _focus={{ bg: 'gray.400' }} p="4">
          <Button
            as="span"
            color="blueGray.900"
            leftIcon={<ArrowLeft size="18px" />}
            size="lg"
            variant="unstyled"
          >
            {currentHost.settings?.name}
          </Button>
          <br />
          <Code bg="blueGray.50" fontSize="xs">
            {currentHost.host}
          </Code>
        </Box>
      </Link>

      <Box p="4">
        <Heading color="blueGray.900" mb="4" size="md" textAlign="center">
          {t('panel')}
        </Heading>

        <Box h="69vh" overflowY="auto">
          <List>
            {routes.map((item) => (
              <ListItem key={item.value} p="0">
                <AdminMenuItem item={item} />
                {item.isMulti &&
                  item.content.map((itemSub) => (
                    <AdminMenuItem
                      key={itemSub.value}
                      item={itemSub}
                      isSub
                      parentValue={item.value}
                    />
                  ))}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* {isSuperAdmin && isPortalHost && platform && (
          <Box mb="2" mt="6">
            <Heading color="gray.50" size="sm">
              {`${platform.name} ${tc('domains.platform')}`}
            </Heading>
            <ListMenu list={superadminMenu} />
          </Box>
        )} */}
      </Box>

      <Box bg="blueGray.800" p="4">
        <Flex>
          <Avatar
            _hover={{ bg: 'brand.500' }}
            bg="brand.600"
            borderRadius="8px"
            showBorder
            size="lg"
            src={currentUser.avatar && currentUser.avatar.src}
          />

          <Box align="flex-start" color="gray.50" textAlign="left" px="3">
            <Text fontSize="lg" fontWeight="bold">
              {currentUser.username}
            </Text>
            <Text fontWeight="light">{getFullName(currentUser)}</Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
