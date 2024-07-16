import React from 'react';

const PaginationOrder = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    console.log(itemsPerPage, totalItems, currentPage, paginate)
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage === pageNumbers.length - 1;

    return (
        <nav>
            <ul className='pagination'>
                <li className={`page-item ${isPreviousDisabled ? 'disabled' : ''}`}>
                    <button
                        onClick={() => !isPreviousDisabled && paginate(currentPage - 1)}
                        className='page-link'
                        disabled={isPreviousDisabled}
                    >
                        Trang trước
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number - 1 === currentPage ? 'active' : ''}`}>
                        <button onClick={() => paginate(number - 1)} className='page-link'>
                            {number}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${isNextDisabled ? 'disabled' : ''}`}>
                    <button
                        onClick={() => !isNextDisabled && paginate(currentPage + 1)}
                        className='page-link'
                        disabled={isNextDisabled}
                    >
                        Trang sau
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PaginationOrder;
