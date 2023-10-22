import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
// import './CustomPagination.css'; // Import the CSS file

function CustomPagination({ totalPages, currentPage, onPageChange }:any) {
  const [selectedPage, setSelectedPage] = useState(currentPage - 1);

  const handlePageClick = ({ selected }:any) => {
    const newPage = selected + 1;
    setSelectedPage(selected);
    onPageChange(newPage);
  };

  const pageRangeDisplayed = 10;
  const halfRange = Math.floor(pageRangeDisplayed / 2);

  const minPageNumber = Math.max(currentPage - halfRange, 1);
  const maxPageNumber = Math.min(minPageNumber + pageRangeDisplayed - 1, totalPages);

  return (
    <div className="pagination-controls">
      <div className="page-navigation">
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={pageRangeDisplayed}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          forcePage={selectedPage}
          containerClassName="pagination"
          activeClassName="selected"
          previousLabel="<"
          nextLabel=">"
          breakLabel={<span>...</span>}
        />
        <div className="page-numbers">
          {/* {minPageNumber > 1 && (
            <>
              <span>1</span>
              {minPageNumber > 2 && <span>...</span>}
            </>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default CustomPagination;
