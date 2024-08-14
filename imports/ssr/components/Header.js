import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Heading, HStack, Img, Text } from '@chakra-ui/react';

export default function Header({ host }) {
  const currentHost = host;
  const menuItems = host?.settings?.menu?.filter((item) => item.isVisible);

  if (!currentHost) {
    return null;
  }

  return (
    <Box p="3" w="100%">
      <Center mb="6">
        <Link to="/">
          {currentHost.logo ? (
            <Box maxHeight="48px">
              <Img className="smaller-logo" maxW={280} h="48px" src={host.logo} />
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
        <HStack alignItems="center" justify="center" mb="2" wrap="wrap">
          {menuItems?.map((item) => (
            <Link key={item.name} to={item.route}>
              <Box px="2">
                <Text
                  as="span"
                  color="brand.500"
                  fontFamily="Raleway, Sarabun, sans-serif"
                  fontWeight="bold"
                >
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
        </HStack>
      </Center>
    </Box>
  );
}
