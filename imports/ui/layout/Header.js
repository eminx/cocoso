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

  return (
    <Box w="100%">
      <Center mb="2">
        <Link to="/" style={{ zIndex: 1405 }}>
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
        <HStack alignItems="center" justify="center" mb="2" wrap="wrap" style={{ zIndex: 1405 }}>
          {menuItems?.map((item) => (
            <Link key={item.name} to={`/${item.name}`}>
              <Box as="span" px="2">
                <Text
                  {...textProps}
                  borderBottom={item?.name === currentMenuItem?.name ? '2px solid' : null}
                >
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
