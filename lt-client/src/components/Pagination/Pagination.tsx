import { useState } from 'react';

import './_index.scss';

type PaginationProps = {
  totalPages: number;
  onPageChange: (page: number) => void;
  page: number;
};

const LIMIT = 5;

const Pagination = ({ totalPages, onPageChange, page }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(page);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const getPageButton = (pageNumber: number) => {
    return (
      <li key={pageNumber}>
        <button
          className={`page-btn ${pageNumber === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      </li>
    );
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= LIMIT) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(getPageButton(i));
      }
      return pageNumbers;
    }

    if (currentPage - 3 <= 1) {
      for (let i = 1; i <= LIMIT; i++) {
        pageNumbers.push(getPageButton(i));
      }
    } else {
      pageNumbers.push(getPageButton(1));
      pageNumbers.push(
        <li key="ellipsis-start" className="ellipsis">
          ...
        </li>
      );

      for (let i = currentPage - 2; i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(getPageButton(i));
      }
    }

    if (currentPage + 2 < totalPages) {
      pageNumbers.push(
        <li key="ellipsis-start" className="ellipsis">
          ...
        </li>
      );

      pageNumbers.push(getPageButton(totalPages));
    }

    return pageNumbers;
  };

  return (
    <div className="lt-Pagination">
      <ul className="list-container">
        <li className="list-item">
          <button
            className={currentPage === 1 ? 'page-btn disabled' : 'page-btn'}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lt; Prev
          </button>
        </li>
        {renderPageNumbers()}
        <li>
          <button
            className={currentPage === totalPages ? 'page-btn disabled' : 'page-btn'}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next &gt;
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
