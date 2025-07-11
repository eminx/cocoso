import React from 'react';
import { Trans } from 'react-i18next';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';
import { GlobalStyles } from 'restyle';

import { Button } from '/imports/ui/core';

export default function GenericMenu({
  align = 'center',
  buttonLabel = <Trans i18nKey="common:labels.select" />,
  leftIcon = null,
  rightIcon = <ChevronDownIcon size="18px" />,
  button = (
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
  ),
  direction = 'bottom',
  children,
  options,
  onSelect,
}) {
  if (!options || !options.length) {
    return null;
  }

  return (
    <>
      <GlobalStyles>
        {{
          '.szh-menu': {
            borderRadius: 'var(--cocoso-border-radius)',
          },
        }}
      </GlobalStyles>
      <Menu
        align={align}
        direction={direction}
        transition
        menuButton={<MenuButton>{button}</MenuButton>}
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
    </>
  );
}
