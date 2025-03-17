import React from 'react';

const ProductFilter = ({ onSortChange }) => {
    return (
        <div className="sidebar">
            <h3>Filters</h3>
            <div className="mb-3">
                <label htmlFor="sort" className="form-label">Sort By</label>
                <select id="sort" className="form-select" onChange={onSortChange}>
                    <option value="">Select</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>
        </div>
    );
};

export default ProductFilter;