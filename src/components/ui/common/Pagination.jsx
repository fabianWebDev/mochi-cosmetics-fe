import classes from './Pagination.module.css';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, onPageSizeChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisibleButtons = 8;

    // Calculate available page size options based on total items
    const getPageSizeOptions = () => {
        const options = [10, 20, 50];
        if (totalItems > 50) {
            options.push(100);
        }
        return options;
    };

    const pageSizeOptions = getPageSizeOptions();

    const getPageNumbers = () => {
        const pageNumbers = [];
        const halfMaxButtons = Math.floor(maxVisibleButtons / 2);

        let startPage = Math.max(1, currentPage - halfMaxButtons);
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={classes.pagination_wrapper}>
            <div className={classes.pagination_controls}>
                <div className={classes.page_size_selector}>
                    <label htmlFor="pageSize" className={classes.page_size_label}>Products per page:</label>
                    <select
                        id="pageSize"
                        value={itemsPerPage}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className={classes.page_size_select}
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={classes.showing_text}>
                    {totalItems > 0 ? (
                        `Showing ${startItem}-${endItem} of ${totalItems} products`
                    ) : (
                        'No products found'
                    )}
                </div>

            </div>
            {totalPages > 1 && (
                <nav className={classes.pagination_container} aria-label="Page navigation">
                    <ul className={classes.pagination_list}>
                        <li className={classes.page_item}>
                            <button
                                className={classes.page_button}
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                            >
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>
                        {getPageNumbers().map((pageNumber) => (
                            <li key={pageNumber} className={classes.page_item}>
                                <button
                                    className={`${classes.page_button} ${currentPage === pageNumber ? classes.active : ''}`}
                                    onClick={() => onPageChange(pageNumber)}
                                    aria-label={`Page ${pageNumber}`}
                                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                                >
                                    {pageNumber}
                                </button>
                            </li>
                        ))}
                        <li className={classes.page_item}>
                            <button
                                className={classes.page_button}
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                            >
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default Pagination;
