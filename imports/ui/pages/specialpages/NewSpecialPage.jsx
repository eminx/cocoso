import React, { createContext, useContext, useEffect, useState } from 'react';
import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

import { call } from '/imports/ui/utils/shared';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { Column, Row } from './components';
import { rowTypes } from './datatypes';

const getNewRow = (rowType) => {
  const selectedRowType = rowTypes.find((type) => type.value === rowType);
  return {
    gridType: selectedRowType.value,
    columns: selectedRowType.columns,
  };
};

export const SpecialPageContext = createContext(null);

export default function NewSpecialPage() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState('Special Page 1');

  const handleAddRow = (rowType) => {
    const newRow = getNewRow(rowType);
    setRows([...rows, newRow]);
  };

  const handleContentSelect = (contentType, columnIndex, rowIndex) => {
    console.log(contentType, columnIndex, rowIndex);
    const newRows = [
      ...rows.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return {
            ...row,
            columns: row.columns.map((column, colIndex) => {
              if (colIndex === columnIndex) {
                return [...column, contentType];
              }
              return column;
            }),
          };
        }
        return row;
      }),
    ];

    setRows(newRows);
  };

  const handleCreate = async () => {
    const newPage = {};
    try {
      await call('createSpecialPage', rows);
    } catch (error) {
      message.error(error.message || error.error);
    }
  };

  const onSortRowsEnd = (oldIndex, newIndex) => {
    console.log(oldIndex, newIndex);
    setRows(arrayMoveImmutable(rows, oldIndex, newIndex));
  };

  return (
    <div>
      <SpecialPageContext.Provider value={{ rows, setRows }}>
        <Heading size="lg" css={{ margin: '24px 0' }}>
          New Special Page
        </Heading>

        <SortableList
          onSortEnd={(oldIndex, newIndex) => {
            console.log(oldIndex, newIndex);
          }}
        >
          {rows.map((row, rowIndex) => (
            <SortableItem key={row.gridType + rowIndex}>
              <Boxling bg="blueGray.300" cursor="move" mb="4" p="2">
                <Row
                  row={row}
                  onContentSelect={(contentType, columnIndex) =>
                    handleContentSelect(contentType, columnIndex, rowIndex)
                  }
                />
                <Center>
                  <Button
                    colorScheme="gray"
                    my="2"
                    size="sm"
                    variant="ghost"
                    onClick={() => setRows(rows.filter((_, i) => i !== rowIndex))}
                  >
                    Remove Row
                  </Button>
                </Center>
              </Boxling>
            </SortableItem>
          ))}
        </SortableList>

        <Center mt="4" mb="12">
          <Menu
            menuButton={
              <Button size="sm" variant="outline">
                Add Row
              </Button>
            }
            transition
            onItemClick={(event) => {
              handleAddRow(event.value);
            }}
          >
            {rowTypes.map((rowType) => (
              <MenuItem key={rowType.value} value={rowType.value}>
                {rowType.label}
              </MenuItem>
            ))}
          </Menu>
        </Center>
      </SpecialPageContext.Provider>

      <Center>
        <Flex bg="blueGray.400" bottom="0" justify="space-between" position="fixed" p="2">
          <Button mx="4" size="sm" variant="ghost">
            Save
          </Button>
          <Button mx="4" size="sm" variant="ghost">
            Preview
          </Button>
          <Button colorScheme="green" mx="4" size="sm" variant="solid">
            Publish
          </Button>
        </Flex>
      </Center>
    </div>
  );
}
