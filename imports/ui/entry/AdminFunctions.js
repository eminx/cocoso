import React from 'react';
import { Center, IconButton, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react';
import Settings from 'lucide-react/dist/esm/icons/settings';
import { useTranslation } from 'react-i18next';

export default function AdminFunctions({ menuItems, onSelect }) {
  const [t] = useTranslation('admin');

  return (
    <>
      <Center>
        <Menu closeOnSelect>
          <MenuButton size="sm">
            <IconButton
              _hover={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.200' }}
              as="span"
              bg="gray.50"
              border="1px solid"
              color="gray.600"
              // borderColor="brand.400"
              borderRadius="50%"
              icon={<Settings />}
              variant="ghost"
            />
            <Text color="gray.50" fontSize="xs">
              {t('label')}
            </Text>
          </MenuButton>
          <MenuList size="lg">
            {menuItems.map((item) => (
              <MenuItem key={item.kind} onClick={() => onSelect(item)}>
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Center>
    </>
  );
}
