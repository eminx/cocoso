import { Center, SimpleGrid, Wrap } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import '../utils/styles/paginate.css';

const defaultItemsPerPage = 12;

function PaginatedItems({ items, itemsPerPage = defaultItemsPerPage, grid, wrap, children }) {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, items, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      {grid && (
        <SimpleGrid {...grid}>
          {currentItems && currentItems.map((item) => children(item))}
        </SimpleGrid>
      )}
      {wrap && <Wrap {...wrap}>{currentItems && currentItems.map((item) => children(item))}</Wrap>}
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
