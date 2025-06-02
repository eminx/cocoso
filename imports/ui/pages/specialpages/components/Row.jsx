import React, { useContext } from 'react';
import { Box, Button, Center, Flex, Heading, IconButton, Text } from '@chakra-ui/react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-vertical';
import TrashIcon from 'lucide-react/dist/esm/icons/trash';
import EditIcon from 'lucide-react/dist/esm/icons/edit';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import { arrayMoveImmutable } from 'array-move';

import Boxling from '/imports/ui/pages/admin/Boxling';
import { call } from '/imports/ui/utils/shared';
import { contentTypes, getGridTemplateColumns } from '../constants';
import { SpecialPageContext } from '../SpecialPageForm';

export function Column({ column, columnIndex, rowIndex }) {
  const { currentPage, setCurrentPage, setContentModal, setDeleteModuleModal } =
    useContext(SpecialPageContext);

  const handleSelectContent = (content) => {
    const { contentRows } = currentPage;
    const newRows = [
      ...contentRows.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return {
            ...row,
            columns: row.columns.map((column, colIndex) => {
              if (colIndex === columnIndex) {
                return [...column, content];
              }
              return column;
            }),
          };
        }
        return row;
      }),
    ];

    setContentModal({
      open: true,
      content: content,
      contentIndex: column.length,
      columnIndex,
      rowIndex,
    });

    setCurrentPage((prevPage) => ({
      ...prevPage,
      contentRows: newRows,
    }));
  };

  const handleSortColumn = (oldIndex, newIndex) => {
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
      ping: true,
    }));
  };

  const handleOpenContentModal = (content, contentIndex) => {
    setContentModal({
      content,
      contentIndex,
      columnIndex,
      rowIndex,
      open: true,
    });
  };

  return (
    <Boxling bg="white" m="2" p="2" minH="120px">
      <Center>
        <SortableList onSortEnd={handleSortColumn}>
          {column.map((content, contentIndex) => (
            <SortableItem key={content.type + contentIndex}>
              <Flex
                align="center"
                bg="blueGray.200"
                borderRadius="md"
                justify="space-between"
                mb="2"
                p="1"
                textAlign="center"
              >
                <SortableKnob>
                  <IconButton
                    colorScheme="gray"
                    cursor="move"
                    icon={<DragHandleIcon size="18px" />}
                    p="2"
                    size="sm"
                    variant="unstyled"
                  />
                </SortableKnob>
                <Button
                  _hover={{ bg: 'blueGray.50' }}
                  colorScheme="blue"
                  cursor="pointer"
                  flexGrow="1"
                  fontWeight="bold"
                  px="2"
                  rightIcon={<EditIcon size="16px" />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenContentModal(content, contentIndex)}
                >
                  {content.type}
                </Button>
                <IconButton
                  colorScheme="red"
                  icon={<TrashIcon size="16px" />}
                  p="2"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setDeleteModuleModal({
                      contentIndex,
                      columnIndex,
                      rowIndex,
                      visible: true,
                      moduleType: 'content',
                    })
                  }
                />
              </Flex>
            </SortableItem>
          ))}
        </SortableList>
      </Center>

      <Center>
        <Menu
          menuButton={
            <MenuButton>
              <Button
                colorScheme="blue"
                leftIcon={<AddIcon size="18px" />}
                size="xs"
                variant="ghost"
              >
                Add Content
              </Button>
            </MenuButton>
          }
        >
          {contentTypes.map((content) => (
            <MenuItem key={content.type} onClick={() => handleSelectContent(content)}>
              {content.type}
            </MenuItem>
          ))}
        </Menu>
      </Center>
    </Boxling>
  );
}

const flexBasis = '300px';

export default function Row({ row, rowIndex }) {
  const { columns, gridType } = row;

  if (!columns || !columns.length || !gridType) {
    return null;
  }

  const gridTemplalateColumns = getGridTemplateColumns(gridType);

  return (
    <Box display="grid" gridTemplateColumns={gridTemplalateColumns}>
      {columns.map((column, columnIndex) => (
        <Box key={gridType + columnIndex} gridTemplateColumns={gridTemplalateColumns}>
          <Column column={column} columnIndex={columnIndex} rowIndex={rowIndex} />
        </Box>
      ))}
    </Box>
  );
}
