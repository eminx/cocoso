import React, { useContext } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import SortableList, { SortableItem } from 'react-easy-sort';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import ArrowUpDownIcon from 'lucide-react/dist/esm/icons/arrow-up-down';
import { arrayMoveImmutable } from 'array-move';
import { SortableKnob } from 'react-easy-sort';

import Boxling from '/imports/ui/pages/admin/Boxling';
import { contentTypes, getGridTemplateColumns } from '../constants';
import { ComposablePageContext } from '../ComposablePageForm';
import ContentModule from './ContentModule';
import DropTarget from './DropTarget';
import Menu from '/imports/ui/generic/Menu';

export function Column({ column, columnIndex, rowIndex }) {
  const { setCurrentPage, setContentModal } = useContext(
    ComposablePageContext
  );

  const handleSelectContent = (content) => {
    const newContent = {
      ...content,
      id: Date.now().toString(),
    };

    setCurrentPage((prevPage) => {
      const { contentRows } = prevPage;
      const newRows = [
        ...contentRows.map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return {
              ...row,
              columns: row.columns.map((column, colIndex) => {
                if (colIndex === columnIndex) {
                  return [...column, newContent];
                }
                return column;
              }),
            };
          }
          return row;
        }),
      ];

      return {
        ...prevPage,
        contentRows: newRows,
      };
    });

    setContentModal({
      open: true,
      content: newContent,
      contentIndex: column.length,
      columnIndex,
      rowIndex,
    });
  };

  const handleSortColumn = (oldIndex, newIndex) => {
    setCurrentPage((prevPage) => {
      const { contentRows } = prevPage;

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

      return {
        ...prevPage,
        contentRows: newRows,
        pingSave: true,
      };
    });
  };

  return (
    <Boxling bg="white" m="2" p="2" minH="120px">
      <Center>
        <SortableList onSortEnd={handleSortColumn}>
          {column.map((content, contentIndex) => {
            return (
              <SortableItem
                key={content.id || content.type + contentIndex}
              >
                <Flex
                  _hover={{ bg: 'blueGray.50' }}
                  bg="blueGray.200"
                  borderRadius="md"
                  mb="2"
                  p="1"
                >
                  <SortableKnob>
                    <IconButton
                      colorScheme="gray"
                      cursor="ns-resize"
                      icon={<ArrowUpDownIcon size="16px" />}
                      p="2"
                      size="sm"
                      variant="unstyled"
                    />
                  </SortableKnob>
                  <ContentModule
                    content={content}
                    contentIndex={contentIndex}
                    columnIndex={columnIndex}
                    rowIndex={rowIndex}
                  />
                </Flex>
              </SortableItem>
            );
          })}
        </SortableList>
      </Center>

      <DropTarget columnIndex={columnIndex} rowIndex={rowIndex} />

      <Center>
        <Menu
          buttonLabel={
            <Trans i18nKey="admin:composable.form.addContent" />
          }
          leftIcon={<AddIcon size="18px" />}
          options={contentTypes.map((content) => ({
            ...content,
            key: content.type,
          }))}
          onSelect={handleSelectContent}
        >
          {(item) => (
            <Trans
              i18nKey={`admin:composable.form.types.${item.type}`}
            />
          )}
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

  const gridTemplateColumns = getGridTemplateColumns(gridType);

  return (
    <Box display="grid" gridTemplateColumns={gridTemplateColumns}>
      {columns.map((column, columnIndex) => (
        <Box
          key={gridType + columnIndex}
          gridTemplateColumns={gridTemplateColumns}
        >
          <Column
            column={column}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        </Box>
      ))}
    </Box>
  );
}
