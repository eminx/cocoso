import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

import { call } from '/imports/ui/utils/shared';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { message } from '/imports/ui/generic/message';
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

export default function SpecialPageForm() {
  const [currentPage, setCurrentPage] = useState(null);
  const { specialPageId } = useParams();

  const getSpecialPageById = async (id) => {
    try {
      const response = await call('getSpecialPageById', id);
      console.log(response);
      setCurrentPage(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    if (!specialPageId) {
      return;
    }
    getSpecialPageById(specialPageId);
  }, [specialPageId]);

  const handleAddRow = (rowType) => {
    const newRow = getNewRow(rowType);
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: [...currentPage.contentRows, newRow],
    }));
  };

  const handleSortRows = (oldIndex, newIndex) => {
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: arrayMoveImmutable(prevPage.contentRows, oldIndex, newIndex),
    }));
  };

  const handleRemoveRow = (rowIndex) => {
    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: prevPage.contentRows.filter((_, index) => index !== rowIndex),
    }));
  };

  const handleContentSelect = (contentType, columnIndex, rowIndex) => {
    console.log(contentType, columnIndex, rowIndex);

    const { contentRows } = currentPage;
    const newRows = [
      ...contentRows.map((row, rIndex) => {
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

    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: newRows,
    }));
  };

  const handleColumnSort = (oldIndex, newIndex, columnIndex, rowIndex) => {
    const { contentRows } = currentPage;
    const newRows = [
      ...contentRows.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return {
            ...row,
            columns: row.columns.map((column, colIndex) => {
              if (colIndex === columnIndex) {
                return arrayMoveImmutable(column, oldIndex, newIndex);
              }
              return column;
            }),
          };
        }
        return row;
      }),
    ];

    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: newRows,
    }));
  };

  const updateSpecialPage = async () => {
    const newPage = { title: currentPage.title, contentRows: currentPage.contentRows };
    try {
      await call('updateSpecialPage', currentPage._id, newPage);
      message.success('Special page updated successfully');
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentPage) {
    return null;
  }

  return (
    <div>
      <SpecialPageContext.Provider value={{ currentPage, setCurrentPage }}>
        <Heading size="lg" css={{ margin: '24px 0' }}>
          {currentPage.title}
        </Heading>

        <SortableList onSortEnd={handleSortRows}>
          {currentPage.contentRows?.map((row, rowIndex) => (
            <SortableItem key={row.gridType + rowIndex}>
              <Boxling bg="blueGray.300" cursor="move" mb="4" p="2">
                <Row
                  row={row}
                  onContentSelect={(contentType, columnIndex) =>
                    handleContentSelect(contentType, columnIndex, rowIndex)
                  }
                  onColumnSort={(oldIndex, newIndex, columnIndex) => {
                    console.log(oldIndex, newIndex, columnIndex);
                    handleColumnSort(oldIndex, newIndex, columnIndex, rowIndex);
                  }}
                />
                <Center>
                  <Button
                    colorScheme="gray"
                    my="2"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveRow(rowIndex)}
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
          <Button mx="4" size="sm" variant="ghost" onClick={() => updateSpecialPage()}>
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
