import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, IconButton, Text, VStack } from '@chakra-ui/react';

import Drawer from './Drawer';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

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
  const [t] = useTranslation('hosts');

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
          <Flex flexDirection="column" align="center">
            <IconButton bg="none" icon={<HamburgerIcon fontSize="36px" />} onClick={onToggle} />
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
              {t('menu.label')}
            </Text>
          </Flex>
        </Center>

        <Drawer isOpen={isOpen} placement="left" title={t('menu.label')} onClose={onToggle}>
          <VStack align="flex-start" pt="8">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.route} onClick={onToggle}>
                <Box px="4" py="2">
                  <Text fontSize="lg">{item.label}</Text>
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
        <Flex flexDirection="column" align="center">
          <IconButton bg="none" icon={<HamburgerIcon fontSize="36px" />} onClick={onToggle} />
          <Text
            fontSize="12px"
            fontWeight="bold"
            position="absolute"
            top="68px"
            textTransform="uppercase"
          >
            {t('menu.label')}
          </Text>
        </Flex>
      </Center>

      <Drawer isOpen={isOpen} placement="right" title={t('menu.label')} onClose={onToggle}>
        <VStack align="flex-start" pt="8">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.route} onClick={onToggle}>
              <Box px="4" py="2">
                <Text fontSize="lg">{item.label}</Text>
              </Box>
            </Link>
          ))}
        </VStack>
      </Drawer>
    </Box>
  );
}
