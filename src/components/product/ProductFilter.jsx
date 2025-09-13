import React from 'react';
import styles from './ProductFilter.module.css';

const ProductFilter = ({ onSortChange, onStockFilterChange, showInStockOnly }) => {
    return (
        <div className={styles.sidebar + ' mb-2'}>
            <div className="mb-2">
                <label htmlFor="sort" className={styles.form_label}>Sort By</label>
                <select id="sort" className={styles.form_select} onChange={onSortChange}>
                    <option value="">Select</option>
                    <option value="a-z">A - Z</option>
                    <option value="z-a">Z - A</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>
            <div>
                <div className={styles.checkbox_container}>
                    <input
                        type="checkbox"
                        id="inStock"
                        checked={showInStockOnly}
                        onChange={onStockFilterChange}
                        className={styles.checkbox}
                    />
                    <label htmlFor="inStock" className={styles.checkbox_label}>
                        In-Stock
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;