import React from 'react';
import { Trans } from 'react-i18next';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { Button } from '/imports/ui/core';

export default function GenericMenu({
  buttonLabel = <Trans i18nKey="common:labels.select" />,
  children,
  options,
  leftIcon = null,
  rightIcon = <ChevronDownIcon size="18px" />,
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
            as="a"
            colorScheme="blue"
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            size="sm"
            variant="ghost"
          >
            {buttonLabel}
          </Button>
        </MenuButton>
      }
    >
      {options.map((item) => (
        <MenuItem
          key={item.key || item.value}
          onClick={() => onSelect(item)}
        >
          {children(item)}
        </MenuItem>
      ))}
    </Menu>
  );
}
