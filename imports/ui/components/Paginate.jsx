import { Center, SimpleGrid, Wrap } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import '../utils/styles/paginate.css';

const defaultItemsPerPage = 12;

function PaginatedItems({
  grid = { columns: [1, 1, 2, 3], spacing: 3, w: '100%' },
  isContainerSimpleGrid = true,
  items,
  itemsPerPage = defaultItemsPerPage,
  children,
}) {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
    window.scrollTo(0, 0);
  }, [itemOffset, items, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      {isContainerSimpleGrid ? (
        <SimpleGrid {...grid}>
          {currentItems && currentItems.map((item) => children(item))}
        </SimpleGrid>
      ) : (
        <Wrap justify="center">{currentItems && currentItems.map((item) => children(item))}</Wrap>
      )}
      {items.length > itemsPerPage && (
        <Center>
          <ReactPaginate
            containerClassName="paginate"
            pageLinkClassName="paginate-btn"
            previousLinkClassName="paginate-btn"
            nextLinkClassName="paginate-btn"
            activeLinkClassName="paginate-active-btn"
            previousLabel="Prev"
            nextLabel="Next"
            breakLabel="..."
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
          />
        </Center>
      )}
    </>
  );
}

export default PaginatedItems;
