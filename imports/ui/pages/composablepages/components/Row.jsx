import React, { useContext } from 'react';
import { styled } from 'restyle';
import { Trans } from 'react-i18next';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import ArrowUpDownIcon from 'lucide-react/dist/esm/icons/arrow-up-down';
import { arrayMoveImmutable } from 'array-move';

import { Box, Center, Flex, IconButton } from '/imports/ui/core';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { contentTypes, getGridTemplateColumns } from '../constants';
import { ComposablePageContext } from '../ComposablePageForm';
import ContentModule from './ContentModule';
import DropTarget from './DropTarget';
import Menu from '/imports/ui/generic/Menu';

export function Column({ column, columnIndex, rowIndex }) {
  const { setCurrentPage, setContentModal } = useContext(ComposablePageContext);

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
    <Boxling
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        minHeight: '120px',
        padding: '0.5rem',
      }}
    >
      <Center>
        <SortableList onSortEnd={handleSortColumn}>
          {column.map((content, contentIndex) => {
            return (
              <SortableItem
                key={content.id || content.type + contentIndex}
                style={{ width: '100%' }}
              >
                <div>
                  <Flex
                    bg="bluegray.200"
                    mb="2"
                    p="2"
                    w="100%"
                    css={{
                      borderRadius: '0.5rem',
                      '&:hover': {
                        backgroundColor: 'bluegray.50',
                      },
                    }}
                  >
                    <SortableKnob>
                      {/* <IconButton
                      aria-label="Move content"
                      icon={<ArrowUpDownIcon size="16px" />}
                      size="sm"
                      variant="ghost"
                      style={{
                        cursor: 'ns-resize',
                      }}
                    /> */}
                      <button
                        style={{ cursor: 'ns-resize', padding: '0.25rem' }}
                      >
                        <ArrowUpDownIcon size="16px" />
                      </button>
                    </SortableKnob>
                    <div style={{ flexGrow: '1' }}>
                      <ContentModule
                        content={content}
                        contentIndex={contentIndex}
                        columnIndex={columnIndex}
                        rowIndex={rowIndex}
                      />
                    </div>
                  </Flex>
                </div>
              </SortableItem>
            );
          })}
        </SortableList>
      </Center>

      <DropTarget columnIndex={columnIndex} rowIndex={rowIndex}>
        <div style={{ width: '100%' }}>
          <Center>
            <Menu
              buttonLabel={<Trans i18nKey="admin:composable.form.addContent" />}
              leftIcon={<AddIcon size="18px" />}
              options={contentTypes.map((content) => ({
                ...content,
                key: content.type,
              }))}
              onSelect={handleSelectContent}
            >
              {(item) => (
                <Trans i18nKey={`admin:composable.form.types.${item.type}`} />
              )}
            </Menu>
          </Center>
        </div>
      </DropTarget>
    </Boxling>
  );
}

const GridRow = styled('div', (props) => ({
  backgroundColor: 'var(--cocoso-colors-bluegray-300)',
  borderRadius: '0.5rem',
  display: 'grid',
  gridTemplateRows: '1fr',
  gap: '0.5rem',
  padding: '0.5rem',
  width: '100%',
  gridTemplateColumns: props.gridTemplateColumns,
}));

export default function Row({ row, rowIndex }) {
  const { columns, gridType } = row;

  if (!columns || !columns.length || !gridType) {
    return null;
  }

  const gridTemplateColumns = getGridTemplateColumns(gridType);

  return (
    <GridRow gridTemplateColumns={gridTemplateColumns}>
      {columns.map((column, columnIndex) => (
        <Box key={gridType + columnIndex}>
          <Column
            column={column}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        </Box>
      ))}
    </GridRow>
  );
}
