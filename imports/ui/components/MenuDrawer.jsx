import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Flex, Heading, IconButton, Text, VStack } from '@chakra-ui/react';

import Drawer from './Drawer';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
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

  let menuClassName = 'menu-drawer';
  if (isOpen) {
    menuClassName += ' menu-drawer--open';
  }

  if (isDesktop) {
    return (
      <Box className={menuClassName} position="relative" flexGrow="0" flexShrink="0">
        <Box className={menuClassName} position="fixed" bg="gray.100" h="100vh">
          {!isOpen ? (
            <Center pt="6">
              <Flex flexDirection="column" align="center">
                <IconButton bg="none" icon={<HamburgerIcon fontSize="36px" />} onClick={onToggle} />
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                  {t('menu.label')}
                </Text>
              </Flex>
            </Center>
          ) : (
            <Box pt="4">
              <Flex align="flex-start" justify="space-between">
                <Heading fontSize="24px" px="4" mt="2">
                  {t('menu.label')}
                </Heading>
                <IconButton bg="none" icon={<CloseIcon />} mr="4" onClick={onToggle} />
              </Flex>

              <VStack align="flex-start" p="4" mt="4">
                {menuItems.map((item) => (
                  <Link key={item.label} to={item.route} onClick={onToggle}>
                    <Box px="4" pb="2">
                      <Text fontSize="lg">{item.label}</Text>
                    </Box>
                  </Link>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
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
