import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, HStack, Img, Text } from '@chakra-ui/react';

export default function Header({ host }) {
  const menuItems = host?.settings?.menu?.filter((item) => item.isVisible);

  return (
    <>
      <Center p="4" mb="24px">
        {host.logo && <Img maxW={280} maxH={120} src={host.logo} />}
      </Center>

      <Center p="4" mt="4" mb="12px">
        <HStack alignItems="center" justify="center" mb="2" wrap="wrap">
          {menuItems.map((item) => (
            <Link key={item.name} style={{ color: 'blue', marginRight: 12 }} to={item.route}>
              <Box px="2">
                <Text as="span" fontFamily="'Helvetica', sans-serif">
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
        </HStack>
      </Center>
    </>
  );
}
