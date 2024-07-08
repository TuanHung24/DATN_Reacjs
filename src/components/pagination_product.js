function PaginationProduct({ currentPage, productsPerPage, totalProducts, paginate }) {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < pageNumbers.length) {
            paginate(currentPage + 1);
        }
    };

    return (
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <a onClick={handlePrevious} href="#!" className="page-link">
                        Trang trước
                    </a>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href="#!" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a onClick={handleNext} href="#!" className="page-link">
                        Trang sau
                    </a>
                </li>
            </ul>
        </nav>
    );
}
export default PaginationProduct;