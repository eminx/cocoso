import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Center, Heading, HStack, Img, Text } from '@chakra-ui/react';

export default function Header({ Host, isLogoSmall = false }) {
  const currentHost = Host;
  const location = useLocation();

  if (!currentHost) {
    return null;
  }

  const menuItems = Host?.settings?.menu?.filter((item) => item.isVisible);
  const currentMenuItem = menuItems.find((item) => '/' + item.name === location.pathname);

  return (
    <Box w="100%">
      <Center mb="3">
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

      <Center p="4" mb="4">
        <HStack alignItems="center" justify="center" mb="2" wrap="wrap">
          {menuItems?.map((item) => (
            <Link key={item.name} to={`/${item.name}`}>
              <Box px="2">
                <Text
                  _hover={{ borderBottom: '1px solid' }}
                  as="span"
                  borderBottom={item?.name === currentMenuItem?.name ? '2px solid' : null}
                  color="gray.700"
                  fontFamily="Sarabun, sans-serif"
                  fontSize={18}
                  textShadow="1px 1px 1px #fff"
                  fontWeight="400"
                >
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
          {Host.isPortalHost && (
            <Box px="2">
              <Text
                as="span"
                color="brand.500"
                fontFamily="Raleway, Sarabun, sans-serif"
                fontWeight="bold"
              >
                Communities
              </Text>
            </Box>
          )}
        </HStack>
      </Center>
    </Box>
  );
}
