import React from 'react';
import { Trans } from 'react-i18next';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';
// Styles are loaded in Header.js

import { Button } from '/imports/ui/core';

interface MenuOption {
  key?: string;
  value?: string;
  label?: string;
  [key: string]: any;
}

interface GenericMenuProps {
  align?: 'start' | 'center' | 'end';
  button?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  leftIcon?: React.ReactNode;
  options?: MenuOption[];
  rightIcon?: React.ReactNode;
  children?: ((item: MenuOption) => React.ReactNode) | React.ReactNode;
  onSelect?: (item: MenuOption) => void;
}

export default function GenericMenu({
  align = 'center',
  buttonLabel = <Trans i18nKey="common:labels.select" />,
  button,
  direction = 'bottom',
  leftIcon = null,
  options,
  rightIcon = <ChevronDownIcon width="18" height="18" />,
  children,
  onSelect,
}: GenericMenuProps): React.ReactElement | null {
  // Default button if none provided
  const defaultButton = (
    <Button leftIcon={leftIcon} rightIcon={rightIcon} size="sm" variant="ghost">
      {buttonLabel}
    </Button>
  );

  const finalButton = button || defaultButton;
  if ((!options || options.length === 0) && !children) {
    return null;
  }

  return (
    <>
      <Menu
        align={align}
        direction={direction}
        transition
        menuButton={<MenuButton>{finalButton}</MenuButton>}
      >
        {options
          ? options.map((item) => (
              <MenuItem
                key={item.key || item.value || item.label}
                disabled={item.isDisabled}
                onClick={() => onSelect?.(item)}
              >
                {typeof children === 'function' ? children(item) : item.label}
              </MenuItem>
            ))
          : children}
      </Menu>
    </>
  );
}

export { MenuItem };
