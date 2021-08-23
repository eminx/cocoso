import React from 'react';
import { Menu, List, Box } from 'grommet';
import { MoreVertical } from 'grommet-icons/icons/MoreVertical';
import { Wrap, WrapItem } from '@chakra-ui/react';

function NiceList({ list, actionsDisabled, children, ...otherProps }) {
  return (
    <List pad="none" data={list} {...otherProps}>
      {(listItem) => (
        <ListItemWithActions
          listItem={listItem}
          actionsDisabled={actionsDisabled}
          renderChildren={children}
        />
      )}
    </List>
  );
}

function ListItemWithActions({ listItem, actionsDisabled, renderChildren }) {
  return (
    <Box direction="row" justify="between">
      <Box width="100%">{renderChildren(listItem)}</Box>
      <Box>
        {!actionsDisabled && (
          <Menu
            icon={<MoreVertical size="18px" style={{ marginTop: -6 }} />}
            items={
              listItem.actions &&
              listItem.actions.map((action) => ({
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
    </Box>
  );
}

function GridList({ list, actionsDisabled, children, ...otherProps }) {
  return (
    <Wrap spacing={[4, 5]}>
      {list.map((item) => (
        <WrapItem key={item.username} m={[3, 4]}>
          <Box direction="row">
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
          </Box>
        </WrapItem>
      ))}
    </Wrap>
  );
}

export { GridList };

export default NiceList;
