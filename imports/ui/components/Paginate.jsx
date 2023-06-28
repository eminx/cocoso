import React, { useContext, useEffect, useState } from 'react';
import { Center, Wrap } from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';

import '../utils/styles/paginate.css';

import NewEntryHelper from './NewEntryHelper';
import { StateContext } from '../LayoutContainer';

const defaultItemsPerPage = 12;

function PaginatedItems({
  canCreateContent = false,
  centerItems = false,
  items,
  itemsPerPage = defaultItemsPerPage,
  children,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const { isDesktop } = useContext(StateContext);

  useEffect(() => {
    handlePageChange(0);
  }, [items?.length]);

  useEffect(() => {
    if (!items) {
      return;
    }
    const newPageCount = Math.ceil(items.length / itemsPerPage);
    setPageCount(newPageCount);
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
  }, [itemOffset, items, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page === currentPage) {
      return;
    }
    const newOffset = (page * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Wrap justify={isDesktop ? 'flex-start' : 'center'} spacing="8" shouldWrapChildren>
        {currentItems && currentItems.map((item) => children(item))}
        {canCreateContent && <NewEntryHelper buttonLink="/activities/new" />}
      </Wrap>
      {items && items.length > itemsPerPage && (
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
