import React from 'react';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { useTranslation } from 'react-i18next';

import Menu from '/imports/ui/generic/Menu';
import { IconButton, Text } from '/imports/ui/core';

export default function AdminFunctions({ menuItems, onSelect }) {
  const [t] = useTranslation('admin');

  return (
    <Menu
      align="start"
      button={
        <>
          <IconButton icon={<SettingsIcon />} variant="outline" />
          <Text
            color="brand.50"
            fontSize="xs"
            fontWeight="bold"
            textAlign="center"
          >
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
