import React from 'react';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { useTranslation } from 'react-i18next';

import { Flex, IconButton, Text } from '/imports/ui/core';
import Menu from '/imports/ui/generic/Menu';

export default function AdminFunctions({ menuItems, onSelect }) {
  const [t] = useTranslation('admin');

  return (
    <Menu
      align="start"
      button={
        <Flex direction="column" align="center" gap="0">
          <IconButton icon={<SettingsIcon />} variant="outline" />
          <Text
            color="theme.50"
            fontSize="xs"
            fontWeight="bold"
            textAlign="center"
          >
            {t('label')}
          </Text>
        </Flex>
      }
      direction="top"
      options={menuItems}
      onSelect={onSelect}
    >
      {(item) => item.label}
    </Menu>
  );
}
