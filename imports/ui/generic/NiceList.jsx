import React, { memo } from 'react';
import List from 'rc-virtual-list';
import EllipsisVertical from 'lucide-react/dist/esm/icons/ellipsis-vertical';

import { Box, Flex, IconButton } from '/imports/ui/core';
import Menu, { MenuItem } from '/imports/ui/generic/Menu';

function ListItemWithActions({ listItem, actionsDisabled, renderChildren }) {
  if (!listItem) {
    return null;
  }

  const actions =
    !actionsDisabled &&
    listItem.actions?.map((action) => ({
      key: action.content,
      label: action.content,
      isDisabled: action.isDisabled,
      onClick: action.handleClick,
    }));

  return (
    <Flex align="flex-start" justify="space-between">
      <Box w="100%">{renderChildren(listItem)}</Box>
      {actions && (
        <Menu
          align="end"
          button={<IconButton icon={<EllipsisVertical size="16px" />} />}
          options={actions}
          onSelect={(action) => {
            if (action.isDisabled) {
              return;
            }
            action.onClick();
          }}
        />
      )}
    </Flex>
  );
}

const ListItem = memo(function ({ bg, children }) {
  return (
    <div style={{ width: '100%' }}>
      <Box
        bg={bg}
        mb="2"
        w="100%"
        css={{
          borderRadius: 'var(--cocoso-border-radius)',
        }}
      >
        {children}
      </Box>
    </div>
  );
});

export default function NiceList({
  actionsDisabled = true,
  itemBg,
  keySelector = '_id',
  list,
  spacing = '2',
  virtual = false,
  children,
  ...otherProps
}) {
  const renderChildren = (listItem) => {
    return (
      <ListItem key={listItem[keySelector]} bg={itemBg}>
        <ListItemWithActions
          listItem={listItem}
          actionsDisabled={actionsDisabled}
          renderChildren={children}
        />
      </ListItem>
    );
  };

  if (virtual) {
    return (
      <List data={list} height={1200} itemHeight={152} itemKey={keySelector}>
        {renderChildren}
      </List>
    );
  }

  return (
    <Flex direction="column" gap={spacing} {...otherProps} w="100%">
      {list.map(renderChildren)}
    </Flex>
  );
}
