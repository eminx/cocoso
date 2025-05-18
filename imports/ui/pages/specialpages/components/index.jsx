import React, { useContext } from 'react';
import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import SortableList, { SortableItem } from 'react-easy-sort';

import Boxling from '/imports/ui/pages/admin/Boxling';
import { call } from '/imports/ui/utils/shared';
import { contentTypes } from '../datatypes';
import { SpecialPageContext } from '../NewSpecialPage';

const boxStyle = {
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
};

export function Column({ column, onContentSelect }) {
  return (
    <Boxling bg="white" m="2" p="2" minH="120px">
      <Center>
        <SortableList
          onSortEnd={(oldIndex, newIndex) => {
            console.log(oldIndex, newIndex);
          }}
        >
          {column.map((content, contentIndex) => (
            <SortableItem key={content.value + contentIndex}>
              <Box key={content.value} bg="blueGray.300" mb="2" p="4" textAlign="center">
                <Text fontWeight="bold">{content.label}</Text>
              </Box>
            </SortableItem>
          ))}
        </SortableList>
      </Center>

      <Center>
        <Menu
          menuButton={
            <MenuButton>
              <Button size="sm" variant="ghost">
                Add Content
              </Button>
            </MenuButton>
          }
        >
          {contentTypes.map((contentType) => (
            <MenuItem
              key={contentType.value}
              onClick={() => onContentSelect(contentType, column.length)}
            >
              {contentType.label}
            </MenuItem>
          ))}
        </Menu>
      </Center>
    </Boxling>
  );
}

const flexBasis = '300px';

const getGridTemplateColumns = (gridType) => {
  switch (gridType) {
    case '1+1':
      return 'repeat(2, 1fr)';
    case '1+1+1':
      return 'repeat(3, 1fr)';
    case '1+2':
      return '1fr 2fr';
    case '2+1':
      return '2fr 1fr';
    default:
      return '1fr';
  }
};

export function Row({ row, onContentSelect }) {
  const { columns, gridType } = row;

  if (!columns || !columns.length || !gridType) {
    return null;
  }

  const gridTemplalateColumns = getGridTemplateColumns(gridType);

  return (
    <Box display="grid" gridTemplateColumns={gridTemplalateColumns}>
      {columns.map((column, columnIndex) => (
        <Box key={gridType + columnIndex} gridTemplateColumns={gridTemplalateColumns}>
          <Column
            column={column}
            onContentSelect={(contentType) => onContentSelect(contentType, columnIndex)}
          />
        </Box>
      ))}
    </Box>
  );
}
