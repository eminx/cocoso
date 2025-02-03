import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Code, Heading, List, ListItem, Text } from '@chakra-ui/react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';

import { StateContext } from '../../LayoutContainer';

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
        _hover={{ bg: 'brand.100' }}
        bg={isCurrentRoute && !item.isMulti ? 'brand.50' : 'inherit'}
        borderRightWidth={isCurrentRoute && !item.isMulti ? '3px' : '0'}
        borderRightColor="brand.500"
        p="3"
        py={isSub || (item.isMulti && isCurrentRoute) ? '2' : '3'}
        ml={isSub ? '4' : '0'}
      >
        <Text
          color={isCurrentRoute ? 'brand.800' : 'inherit'}
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
    <Box bg="white" color="blueGray.800" minH="100vh" minW="320px" position="fixed">
      <Box p="4">
        <Link to="/">
          <Button as="span" leftIcon={<ArrowLeft size="18px" />} size="lg" variant="link">
            {currentHost.settings?.name}
          </Button>
          <br />
          <Code bg="brand.100" fontSize="xs">
            {currentHost.host}
          </Code>
        </Link>
      </Box>

      <Box p="4">
        <Heading color="blueGray.900" mb="4" size="md" textAlign="center">
          {t('panel')}
        </Heading>

        <Box h="70vh" overflowY="scroll">
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
    </Box>
  );
}
