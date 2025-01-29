import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Center, Heading, HStack, Img, Text } from '@chakra-ui/react';

const textProps = {
  _hover: { borderBottom: '1px solid' },
  as: 'span',
  color: 'brand.600',
  fontFamily: 'Raleway, Sarabun, sans-serif',
  fontSize: 16,
  textShadow: '1px 1px 1px #fff',
  fontWeight: '500',
};

export default function Header({ Host, isLogoSmall = false }) {
  const currentHost = Host;
  const location = useLocation();

  if (!currentHost) {
    return null;
  }

  const { pathname } = location;
  const menuItems = Host?.settings?.menu?.filter((item) => item.isVisible);
  const currentMenuItem = menuItems.find((item) => `/${item.name}` === pathname);

  const isCurrentPage = (item, index) => {
    if (item.name === currentMenuItem?.name) {
      return true;
    } else if (pathname === '/' && index === 0) {
      return true;
    }
    return false;
  };

  return (
    <Box w="100%">
      <Center mb="2">
        <Link to="/">
          {currentHost.logo ? (
            <Box maxHeight={isLogoSmall ? '48px' : '76px'} p="2">
              <Img
                h={isLogoSmall ? '48px' : '72px'}
                maxW={280}
                objectFit="contain"
                src={Host.logo}
              />
            </Box>
          ) : (
            <Box>
              <Heading color="brand.800" fontWeight="400" fontFamily="Raleway, Sarabun, sans-serif">
                {currentHost.settings?.name}
              </Heading>
            </Box>
          )}
        </Link>
      </Center>

      <Center p="4">
        <HStack
          alignItems="center"
          bg="gray.50"
          borderRadius={6}
          justify="center"
          mb="2"
          p="2"
          wrap="wrap"
        >
          {menuItems?.map((item, index) => (
            <Link key={item.name} to={`/${item.name}`}>
              <Box as="span" px="2">
                <Text {...textProps} borderBottom={isCurrentPage(item, index) ? '2px solid' : null}>
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
          {Host.isPortalHost && (
            <Link to="/communities">
              <Box as="span" px="2">
                <Text
                  {...textProps}
                  borderBottom={pathname === '/communities' ? '2px solid' : null}
                >
                  Communities
                </Text>
              </Box>
            </Link>
          )}
        </HStack>
      </Center>
    </Box>
  );
}
