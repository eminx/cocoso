import React from 'react';
import { Box, Flex, List, ListItem, Menu, MenuItem, MenuButton, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function NiceList({
  actionsDisabled,
  itemBg,
  keySelector = '_id',
  list,
  children,
  spacing = '4',
  ...otherProps
}) {
  return (
    <List spacing={spacing} {...otherProps}>
      {list.map((listItem) => (
        <ListItem key={listItem[keySelector]} bg={itemBg} pl="4" pr="2" py="2">
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

function ListItemWithActions({ listItem, actionsDisabled, renderChildren }) {
  return (
    <Flex justify="space-between">
      <Box w="100%">{renderChildren(listItem)}</Box>
      <Box>
        {!actionsDisabled && (
          <Menu placement="bottom-end">
            <MenuButton>
              <ChevronDownIcon boxSize="6" />
              </MenuButton>
            <MenuList>
              {listItem.actions &&
                listItem.actions.map((action) => (
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
        </Box>
      </Flex>
  );
}

export default NiceList;
