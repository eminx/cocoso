import React from 'react';
import { Menu, List, Box } from 'grommet';
import { MoreVertical } from 'grommet-icons';

function NiceList({ list, actionsDisabled, children, ...otherProps }) {
  return (
    <List pad="none" data={list} {...otherProps}>
      {listItem => (
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
    <Box direction="row">
      <Box flex={{ grow: 1 }}>{renderChildren(listItem)}</Box>
      <Box flex={{ grow: 0 }}>
        {!actionsDisabled && (
          <Menu
            icon={<MoreVertical size="18px" style={{ marginTop: -6 }} />}
            items={listItem.actions.map(action => ({
              label: action.content,
              onClick: action.isDisabled ? null : action.handleClick,
              style: action.isDisabled
                ? {
                    color: '#ccc',
                    cursor: 'not-allowed'
                  }
                : null
            }))}
            background="light-1"
            dropAlign={{ top: 'bottom', right: 'right' }}
          />
        )}
      </Box>
    </Box>
  );
}

export default NiceList;
