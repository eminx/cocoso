import React from 'react';
import { ChromePicker } from 'react-color';
import { Trans } from 'react-i18next';
import { Menu, MenuButton } from '@szhsin/react-menu';

import { Box, Button } from '/imports/ui/core';

export default function GenericColorPicker({ color, onChange }) {
  return (
    <Menu
      menuButton={
        <MenuButton>
          <Box bg={color} p="4" mb="4">
            <Button size="sm" variant="outline">
              <Trans i18nKey="admin:design.color.pick" />
            </Button>
          </Box>
        </MenuButton>
      }
    >
      <ChromePicker color={color} onChange={onChange} />
    </Menu>
  );
}
