import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Trans } from 'react-i18next';

import Menu from '/imports/ui/generic/Menu';
import { Box, Button } from '/imports/ui/core';

export interface GenericColorPickerProps {
  color?: string;
  onChange?: (color: ColorResult) => void;
}

export default function GenericColorPicker({ color, onChange }: GenericColorPickerProps) {
  return (
    <Menu
      button={
        <Box bg={color} p="4" mb="4">
          <Button size="sm" variant="outline">
            <Trans i18nKey="admin:design.color.pick" />
          </Button>
        </Box>
      }
    >
      <ChromePicker color={color} onChange={onChange} />
    </Menu>
  );
}
