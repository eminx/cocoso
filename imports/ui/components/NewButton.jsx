import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Flex, Heading, IconButton, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
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

function NewButton({ canCreateContent, currentHost }) {
  const menu = currentHost.settings.menu;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [tc] = useTranslation('common');

  const menuItems = menu
    .filter((item) => item.isVisible)
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  const pathname = history.location.pathname;

  const isCurrentPage = (name) => {
    if (name === 'info') {
      return pathname.substring(0, 6) === '/pages';
    }
    return name === pathname.substring(1, pathname.length);
  };

  const activeMenuItem = menuItems.find((item) => isCurrentPage(item.name));

  const getPathname = () => {
    if (activeMenuItem.name === 'calendar') {
      return '/activities/new';
    } else if (activeMenuItem.name === 'info') {
      return '/pages/new';
    } else {
      return `/${activeMenuItem.name}/new`;
    }
  };

  const showNewButton = canCreateContent && activeMenuItem && activeMenuItem.name !== 'members';

  return (
    <Box zIndex="1401">
      <Flex align="center">
        {showNewButton && (
          <Link to={getPathname()}>
            <Flex
              align="center"
              className="text-link-container"
              direction="column"
              ml="4"
              position="relative"
            >
              <IconButton
                borderRadius="8px"
                borderWidth="2px"
                borderColor="gray.900"
                color="gray.900"
                icon={<AddIcon fontSize="sm" />}
                size="sm"
                variant="outline"
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.900"
                position="absolute"
                textTransform="uppercase"
                top="2rem"
              >
                {tc('actions.create')}
              </Text>
            </Flex>
          </Link>
        )}
      </Flex>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
      </Modal>
    </Box>
  );
}

export default NewButton;
