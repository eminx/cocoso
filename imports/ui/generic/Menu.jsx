import React from 'react';
import { Button } from '@chakra-ui/react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';

export default function GenericMenu({
  buttonLabel,
  children,
  options,
  leftIcon = null,
  rightIcon = null,
  onSelect,
}) {
  if (!options || !options.length) {
    return null;
  }

  return (
    <Menu
      menuButton={
        <MenuButton>
          <Button
            colorScheme="blue"
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            // size="xs"
            variant="ghost"
          >
            {buttonLabel}
          </Button>
        </MenuButton>
      }
    >
      {options.map((item) => (
        <MenuItem key={item.key} onClick={() => onSelect(item)}>
          {children(item)}
        </MenuItem>
      ))}
    </Menu>
  );
}
