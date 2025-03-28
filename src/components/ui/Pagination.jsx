import classes from '../../styles/Pagination.module.css';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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
                {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index + 1} className={classes.page_item}>
                        <button
                            className={`${classes.page_button} ${currentPage === index + 1 ? classes.active : ''}`}
                            onClick={() => onPageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
                <li className={classes.page_item}>
                    <button
                        className={classes.page_button}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
