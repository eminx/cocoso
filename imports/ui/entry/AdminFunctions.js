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
import { useTranslation } from 'react-i18next';

export default function AdminFunctions({ menuItems }) {
  const [popup, setPopup] = useState('none');
  const [isOpen, setIsOpen] = useState(false);
  const [t] = useTranslation('admin');

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
        <Box>
          <Menu closeOnSelect closeOnBlur isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <MenuButton size="sm" onClick={() => setIsOpen(!isOpen)}>
              <IconButton
                _hover={{ bg: 'brand.200' }}
                _active={{ bg: 'brand.200' }}
                as="span"
                bg="brand.100"
                border="1px solid #fff"
                borderRadius="50%"
                icon={<Settings />}
                variant="ghost"
              />
              <Text color="brand.50" fontSize="xs">
                {t('label')}
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
