import React from 'react';
import { Box, Flex, List, ListItem, Menu, MenuItem, MenuButton, MenuList } from '@chakra-ui/react';
import EllipsisVertical from 'lucide-react/dist/esm/icons/ellipsis-vertical';

function ListItemWithActions({ listItem, actionsDisabled, renderChildren }) {
  if (!listItem) {
    return null;
  }

  const actions = !actionsDisabled && listItem.actions;

  return (
    <Flex align="flex-start" justify="space-between">
      <Box w="100%">{renderChildren(listItem)}</Box>
      {actions && (
        <Menu placement="bottom-end">
          <MenuButton bg="blueGray.50" borderRadius="50%" m="2" p="2" size="xs" type="button">
            <EllipsisVertical />
          </MenuButton>
          <MenuList>
            {actions.map((action) => (
              <MenuItem
                key={action.content}
                isDisabled={action.isDisabled}
                onClick={action.isDisabled ? null : action.handleClick}
              >
                {action.content}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}

export default function NiceList({
  actionsDisabled = true,
  itemBg,
  keySelector = '_id',
  list,
  children,
  spacing = '4',
  ...otherProps
}) {
  return (
    <List spacing={spacing} {...otherProps} p="0">
      {list.map((listItem) => (
        <ListItem key={listItem[keySelector]} bg={itemBg} borderRadius="20px" mb="2">
          {' '}
          <ListItemWithActions
            listItem={listItem}
            actionsDisabled={actionsDisabled}
            renderChildren={children}
          />
        </ListItem>
      ))}
    </List>
  );
}
