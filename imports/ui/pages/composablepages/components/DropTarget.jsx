import React, { useContext } from 'react';
import { Center } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';

import { ComposablePageContext } from '../ComposablePageForm';

export default function DropTarget({ columnIndex, rowIndex }) {
  const { setCurrentPage } = useContext(ComposablePageContext);

  const handleMoveContent = ({ item }) => {
    const oldContentIndex = item.contentIndex,
      oldColumnIndex = item.columnIndex,
      oldRowIndex = item.rowIndex;

    if (oldColumnIndex === columnIndex && oldRowIndex === rowIndex) {
      return;
    }

    setCurrentPage((prevPage) => {
      const { contentRows } = prevPage;
      const itemContent =
        contentRows[oldRowIndex].columns[oldColumnIndex][
          oldContentIndex
        ];

      const newRowsContentRemoved = [
        ...contentRows.map((row, rIndex) => {
          if (rIndex === oldRowIndex) {
            return {
              ...row,
              columns: row.columns.map((column, colIndex) => {
                if (colIndex === oldColumnIndex) {
                  return column.filter(
                    (content, contentIndex) =>
                      contentIndex !== oldContentIndex
                  );
                }
                return column;
              }),
            };
          }
          return row;
        }),
      ];

      const newRowsContentAdded = [
        ...newRowsContentRemoved.map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return {
              ...row,
              columns: row.columns.map((column, colIndex) => {
                if (colIndex === columnIndex) {
                  return [...column, { ...itemContent }];
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
        contentRows: newRowsContentAdded,
        pingSave: true,
      };
    });
  };

  const [{ canDrop, isOver, itemDroppable }, dropRef] = useDrop(() => {
    return {
      accept: 'content',
      drop: (item, monitor) => {
        handleMoveContent({
          item,
        });
      },
      collect: (monitor, props) => {
        return {
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
          itemDroppable: monitor.getItem(),
        };
      },
    };
  });

  const isSameColumn =
    itemDroppable &&
    itemDroppable.columnIndex === columnIndex &&
    itemDroppable.rowIndex === rowIndex;

  const bg =
    !canDrop || isSameColumn
      ? 'none'
      : isOver
      ? 'green.300'
      : 'green.100';

  return (
    <Center
      bg={bg}
      borderRadius="md"
      border={canDrop && !isSameColumn ? '1px dashed' : 'none'}
      borderColor={canDrop && !isSameColumn ? 'green.500' : 'none'}
      p="4"
      ref={dropRef}
      w="100%"
      h="42px"
      transition="all 0.2s ease-in-out"
    />
  );
}
