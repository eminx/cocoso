import React from 'react';

import { Box, Flex, IconButton, VStack } from '/imports/ui/core';
import Menu, { MenuItem } from '/imports/ui/generic/Menu';
import EllipsisVertical from 'lucide-react/dist/esm/icons/ellipsis-vertical';

function ListItemWithActions({
  listItem,
  actionsDisabled,
  renderChildren,
}) {
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
      <Box>{renderChildren(listItem)}</Box>
      {actions && (
        <Menu
          align="end"
          button={
            <IconButton icon={<EllipsisVertical size="16px" />} />
          }
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

export default function NiceList({
  actionsDisabled = true,
  itemBg,
  keySelector = '_id',
  list,
  spacing = '2',
  children,
  ...otherProps
}) {
  return (
    <VStack gap={spacing} {...otherProps} w="100%">
      {list.map((listItem) => (
        <Box
          key={listItem[keySelector]}
          bg={itemBg}
          mb="2"
          w="100%"
          css={{
            borderRadius: 'var(--cocoso-border-radius)',
          }}
        >
          {' '}
          <ListItemWithActions
            listItem={listItem}
            actionsDisabled={actionsDisabled}
            renderChildren={children}
          />
        </Box>
      ))}
    </VStack>
  );
}
