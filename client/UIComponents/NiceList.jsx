import React from 'react';
import { Menu, List, Box } from 'grommet';

function NiceList({ list, actionsDisabled, children, ...otherProps }) {
  return (
    <List
      data={list}
      className="nicelist"
      primaryKey={listItem => (
        <ListItemWithActions
          listItem={listItem}
          actionsDisabled={actionsDisabled}
          renderChildren={children}
        />
      )}
      {...otherProps}
    />
  );
}

function ListItemWithActions({ listItem, actionsDisabled, renderChildren }) {
  return (
    <Box direction="row">
      <Box flex={{ grow: 1 }}>{renderChildren(listItem)}</Box>
      <Box flex={{ grow: 0 }}>
        {!actionsDisabled && (
          <Menu
            label=""
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
