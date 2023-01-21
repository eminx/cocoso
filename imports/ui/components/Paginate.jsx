import { Center, Wrap } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

import '../utils/styles/paginate.css';

const defaultItemsPerPage = 12;

function PaginatedItems({ items, itemsPerPage = defaultItemsPerPage, children }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    handlePageChange(0);
  }, [items]);

  useEffect(() => {
    const newPageCount = Math.ceil(items.length / itemsPerPage);
    setPageCount(newPageCount);
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    window.scrollTo(0, 0);
  }, [itemOffset, items, itemsPerPage]);

  const handlePageChange = (page) => {
    const newOffset = (page * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setCurrentPage(page);
  };

  return (
    <>
      <Wrap justify="center" shouldWrapChildren>
        {currentItems && currentItems.map((item) => children(item))}
      </Wrap>
      {items.length > itemsPerPage && (
        <Center>
          <ReactPaginate
            forcePage={currentPage}
            containerClassName="paginate"
            pageLinkClassName="paginate-btn"
            previousLinkClassName="paginate-btn"
            nextLinkClassName="paginate-btn"
            activeLinkClassName="paginate-active-btn"
            previousLabel="Prev"
            nextLabel="Next"
            breakLabel="..."
            onPageChange={(event) => handlePageChange(event.selected)}
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
