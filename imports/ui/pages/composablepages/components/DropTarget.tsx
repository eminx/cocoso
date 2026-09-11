import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

import { Center } from '/imports/ui/core';

import { ComposablePageContext } from '../ComposablePageForm';

export default function DropTarget({ columnIndex, rowIndex, children }) {
  const { setCurrentPage } = useContext(ComposablePageContext);
  const [justDropped, setJustDropped] = useState(false);
  const justDroppedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (justDroppedTimeoutRef.current) {
        clearTimeout(justDroppedTimeoutRef.current);
      }
    };
  }, []);

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
        contentRows[oldRowIndex]?.columns[oldColumnIndex]?.[oldContentIndex];

      if (!itemContent || !itemContent.type) {
        return prevPage;
      }

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
        // The "Add content" button below occupies this same drop zone and
        // is only hidden while canDrop is true. canDrop flips back to
        // false the instant the drop resolves, re-exposing a clickable
        // button right under the pointer before the browser's own
        // click-after-drop event (if any) has been dispatched — keep it
        // hidden a little longer so that click can't land on it and
        // spuriously inject an unrelated content item into this column.
        setJustDropped(true);
        if (justDroppedTimeoutRef.current) {
          clearTimeout(justDroppedTimeoutRef.current);
        }
        justDroppedTimeoutRef.current = setTimeout(
          () => setJustDropped(false),
          300
        );
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
          borderColor:
            canDrop && !isSameColumn
              ? 'var(--cocoso-colors-green-500)'
              : 'none',
          borderRadius: '0.5rem',
          borderWidth: '2px',
          minHeight: '102px',
          transition: 'all 0.2s ease-in-out',
          width: '100%',
        }}
      >
        {canDrop || justDropped ? null : children}
      </Center>
    </div>
  );
}
