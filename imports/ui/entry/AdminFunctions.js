import React from 'react';
import { IconButton } from '@chakra-ui/react';
import Settings from 'lucide-react/dist/esm/icons/settings';
import { useTranslation } from 'react-i18next';

import Menu from '/imports/ui/generic/Menu';
import { Text } from '/imports/ui/core';

export default function AdminFunctions({ menuItems, onSelect }) {
  const [t] = useTranslation('admin');

  return (
    <Menu
      align="start"
      button={
        <>
          <IconButton
            _hover={{ bg: 'brand.100' }}
            _active={{ bg: 'brand.200' }}
            as="span"
            bg="brand.50"
            border="1px solid"
            color="brand.600"
            borderRadius="50%"
            icon={<Settings />}
            variant="ghost"
          />
          <Text color="brand.50" fontSize="xs" fontWeight="bold">
            {t('label')}
          </Text>
        </>
      }
      direction="top"
      options={menuItems}
      onSelect={onSelect}
    >
      {(item) => item.label}
    </Menu>
  );
}
