import React from 'react';
import { ChromePicker } from 'react-color';
import { Menu, MenuButton } from '@szhsin/react-menu';

import { Button } from '/imports/ui/core';

export default function GenericColorPicker({ color, onChange }) {
  return (
    <Menu
      menuButton={
        <MenuButton>
          <Button variant="outline">Pick color</Button>
        </MenuButton>
      }
    >
      <ChromePicker color={color} onChange={onChange} />
    </Menu>
  );
}
