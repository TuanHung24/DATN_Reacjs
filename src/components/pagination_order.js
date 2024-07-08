import React from 'react';

const PaginationOrder = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={() => paginate(currentPage - 1)} className='page-link'>
                        Trang trước
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                    <button onClick={() => paginate(currentPage + 1)} className='page-link'>
                        Trang sau
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PaginationOrder;
