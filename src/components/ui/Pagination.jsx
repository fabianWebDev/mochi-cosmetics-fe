import classes from '../../styles/Pagination.module.css';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisibleButtons = 8;

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

    return (
        <nav className={classes.pagination_container} aria-label="Page navigation">
            <ul className={classes.pagination_list}>
                <li className={classes.page_item}>
                    <button
                        className={classes.page_button}
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>
                {getPageNumbers().map((pageNumber) => (
                    <li key={pageNumber} className={classes.page_item}>
                        <button
                            className={`${classes.page_button} ${currentPage === pageNumber ? classes.active : ''}`}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    </li>
                ))}
                {currentPage < totalPages && (
                    <li className={classes.page_item}>
                        <button
                            className={classes.page_button}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
