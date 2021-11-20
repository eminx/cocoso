import React from 'react';
import {
  Box,
  Flex,
  List,
  ListItem,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MoreVertical } from 'grommet-icons/icons/MoreVertical';

function NiceList({ list, actionsDisabled, children, ...otherProps }) {
  return (
    <List spacing={4} {...otherProps}>
      {list.map((listItem) => (
        <ListItem key={listItem.label}>
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

function GridList({ list, actionsDisabled, children, ...otherProps }) {
  return (
    <Wrap spacing={[4, 5]}>
      {list.map((item) => (
        <WrapItem key={item.username} m={[3, 4]}>
          <Flex>
            <Box>{children(item)}</Box>
            <Box>
              {!actionsDisabled && (
                <Menu
                  icon={<MoreVertical size="18px" style={{ marginTop: -6 }} />}
                  items={
                    item.actions &&
                    item.actions.map((action) => ({
                      label: action.content,
                      onClick: action.isDisabled ? null : action.handleClick,
                      style: action.isDisabled
                        ? {
                            color: '#ccc',
                            cursor: 'not-allowed',
                          }
                        : null,
                    }))
                  }
                  background="light-1"
                  dropAlign={{ top: 'bottom', right: 'right' }}
                />
              )}
            </Box>
          </Flex>
        </WrapItem>
      ))}
    </Wrap>
  );
}

export { GridList };

export default NiceList;
