import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';

import { Center } from '/imports/ui/core';

import { ComposablePageContext } from '../ComposablePageForm';

export default function DropTarget({ columnIndex, rowIndex, children }) {
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
        contentRows[oldRowIndex].columns[oldColumnIndex][oldContentIndex];

      const newRowsContentRemoved = [
        ...contentRows.map((row, rIndex) => {
          if (rIndex === oldRowIndex) {
            return {
              ...row,
              columns: row.columns.map((column, colIndex) => {
                if (colIndex === oldColumnIndex) {
                  return column.filter(
                    (content, contentIndex) => contentIndex !== oldContentIndex
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
    !canDrop || isSameColumn ? 'green.50' : isOver ? 'green.300' : 'green.100';

  return (
    <div ref={dropRef}>
      <Center
        bg={bg}
        mb="2"
        p="0"
        css={{
          border: canDrop && !isSameColumn ? '1px dashed' : 'none',
          borderWidth: '2px',
          borderColor: canDrop && !isSameColumn ? 'green.500' : 'none',
          borderRadius: '0.5rem',
          minHeight: '102px',
          transition: 'all 0.2s ease-in-out',
          width: '100%',
        }}
      >
        {canDrop ? null : children}
      </Center>
    </div>
  );
}
