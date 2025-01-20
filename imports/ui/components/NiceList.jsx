import React from 'react';
import { Box, Flex, List, ListItem, Menu, MenuItem, MenuButton, MenuList } from '@chakra-ui/react';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

function NiceList({
  actionsDisabled = true,
  itemBg,
  keySelector = '_id',
  list,
  children,
  spacing = '4',
  ...otherProps
}) {
  return (
    <List spacing={spacing} {...otherProps} p="0" data-oid="_5jkdm:">
      {list.map((listItem) => (
        <ListItem key={listItem[keySelector]} bg={itemBg} mb="2" data-oid="kpm5cou">
          {' '}
          <ListItemWithActions
            listItem={listItem}
            actionsDisabled={actionsDisabled}
            renderChildren={children}
            data-oid="di_.nzp"
          />
        </ListItem>
      ))}
    </List>
  );
}

function ListItemWithActions({ listItem, actionsDisabled, renderChildren }) {
  return (
    <Flex justify="space-between" data-oid="qy1d_r:">
      <Box w="100%" data-oid="yyr9jjv">
        {renderChildren(listItem)}
      </Box>
      <Box data-oid="sfprq3:">
        {!actionsDisabled && (
          <Menu placement="bottom-end" data-oid="xwvtwwn">
            <MenuButton type="button" data-oid="3fy8heh">
              <ChevronDownIcon boxSize="6" data-oid="xn_a0n8" />
            </MenuButton>
            <MenuList data-oid=".uyprdu">
              {listItem?.actions &&
                listItem?.actions.map((action) => (
                  <MenuItem
                    key={action.content}
                    isDisabled={action.isDisabled}
                    onClick={action.isDisabled ? null : action.handleClick}
                    data-oid="nl1ldjo"
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
