import { Center, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import '../utils/styles/paginate.css';

function PaginatedItems({ items, itemsPerPage = 6, grid, children }) {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <SimpleGrid {...grid}>
        {currentItems && currentItems.map((item) => children(item))}
      </SimpleGrid>
      <Center>
        <ReactPaginate
          containerClassName="paginate"
          pageLinkClassName="paginate-btn"
          previousLinkClassName="paginate-btn"
          nextLinkClassName="paginate-btn"
          activeLinkClassName="paginate-active-btn"
          previousLabel="< previous"
          nextLabel="next >"
          breakLabel="..."
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
        />
      </Center>
    </>
  );
}

export default PaginatedItems;
