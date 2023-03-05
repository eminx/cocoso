import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, IconButton, Text, VStack } from '@chakra-ui/react';

import Drawer from './Drawer';
import { HamburgerIcon } from '@chakra-ui/icons';

const getRoute = (item, index) => {
  if (index === 0) {
    return '/';
  }
  if (item.name === 'info') {
    return '/pages/about';
  }
  return `/${item.name}`;
};

export default function MenuDrawer({ currentHost, isDesktop }) {
  const [isOpen, setIsOpen] = useState(false);

  const { menu } = currentHost?.settings;

  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  const onToggle = () => setIsOpen(!isOpen);

  if (isDesktop) {
    return (
      <Box bg="gray.100" h="100vh" position="fixed" pt="24px" w="72px">
        <Center>
          <IconButton bg="none" icon={<HamburgerIcon fontSize="32px" />} onClick={onToggle} />
        </Center>

        <Drawer isOpen={isOpen} placement="left" onClose={onToggle}>
          <VStack align="flex-start" pt="8">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.route} onClick={onToggle}>
                <Box px="4" py="2">
                  <Text color="gray.900" fontSize="lg">
                    {item.label}
                  </Text>
                </Box>
              </Link>
            ))}
          </VStack>
        </Drawer>
      </Box>
    );
  }

  return (
    <Box>
      <Center>
        <IconButton bg="none" icon={<HamburgerIcon fontSize="32px" />} onClick={onToggle} />
      </Center>

      <Drawer isOpen={isOpen} placement="right" onClose={onToggle}>
        <VStack align="flex-start" pt="8">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.route} onClick={onToggle}>
              <Box px="4" py="2">
                <Text color="gray.900" fontSize="lg">
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
        </VStack>
      </Drawer>
    </Box>
  );
}
