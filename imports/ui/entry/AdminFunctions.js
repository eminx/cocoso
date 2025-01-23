import React, { useState } from 'react';
import {
  Box,
  Center,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import Settings from 'lucide-react/dist/esm/icons/settings';

export default function AdminFunctions({ menuItems }) {
  const [popup, setPopup] = useState('none');
  const [isOpen, setIsOpen] = useState(false);

  const handleClickItem = (item) => {
    if (!item) {
      return;
    }
    if (item.onClick && typeof item.onClick === 'function') {
      item.onClick();
      return;
    }
    setPopup(item.kind);
    setTimeout(() => setIsOpen(false), 1000);
  };

  const onClose = () => {
    setPopup('none');
    setTimeout(() => setIsOpen(false), 1000);
  };

  return (
    <>
      <Center position="relative">
        <Box pt="2" position="absolute" top="-8px" w="100px">
          <Menu closeOnSelect closeOnBlur isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <MenuButton size="sm" onClick={() => setIsOpen(!isOpen)}>
              <IconButton
                _hover={{ bg: 'brand.100' }}
                _active={{ bg: 'brand.200' }}
                as="span"
                bg="brand.50"
                border="1px solid #fff"
                borderRadius="50%"
                icon={<Settings />}
                variant="ghost"
              />
              <Text color="brand.200" fontSize="xs">
                {/* {t('admin.admin')} */}
                Admin
              </Text>
            </MenuButton>
            <MenuList size="lg">
              {menuItems().map((item) => (
                <MenuItem key={item.kind} onClick={() => handleClickItem(item)}>
                  {item.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Center>

      {menuItems(onClose).find((item) => item.kind === popup)?.component}
    </>
  );
}
