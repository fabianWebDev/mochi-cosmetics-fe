/**
 * Product Filters Hook
 * 
 * This hook provides a React-friendly interface for filtering and sorting
 * product lists. It manages various filter states including sorting options,
 * stock availability filters, and pagination controls. The hook uses memoization
 * to optimize performance when filtering large product lists.
 * 
 * Key Features:
 * - Product sorting by name and price (ascending/descending)
 * - Stock availability filtering
 * - Pagination state management
 * - Memoized filtering for performance optimization
 * - Configurable products per page
 * 
 * @module useProductFilters
 * @requires react - React hooks for state management and memoization
 * 
 * @example
 * import { useProductFilters } from '../hooks/useProductFilters';
 * 
 * function ProductListComponent({ products }) {
 *   const {
 *     sortOrder,
 *     setSortOrder,
 *     showInStockOnly,
 *     setShowInStockOnly,
 *     currentPage,
 *     setCurrentPage,
 *     productsPerPage,
 *     setProductsPerPage,
 *     sortedProducts
 *   } = useProductFilters(products);
 * 
 *   return (
 *     <div>
 *       <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
 *         <option value="">Sort by...</option>
 *         <option value="a-z">Name A-Z</option>
 *         <option value="z-a">Name Z-A</option>
 *         <option value="price_asc">Price Low to High</option>
 *         <option value="price_desc">Price High to Low</option>
 *       </select>
 *       
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={showInStockOnly}
 *           onChange={(e) => setShowInStockOnly(e.target.checked)}
 *         />
 *         Show in stock only
 *       </label>
 *       
 *       {sortedProducts.map(product => (
 *         <div key={product.id}>{product.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */

import { useState, useMemo } from "react";

/**
 * Custom hook for filtering and sorting product lists
 * 
 * This hook provides a reactive interface for managing product filters and sorting.
 * It handles various sorting options (name and price), stock availability filtering,
 * and pagination state. The filtering logic is memoized to prevent unnecessary
 * recalculations when dependencies haven't changed.
 * 
 * @param {Array} [initialProducts=[]] - Array of product objects to filter and sort
 * @returns {Object} Product filtering state and methods
 * @returns {string} returns.sortOrder - Current sort order ('a-z', 'z-a', 'price_asc', 'price_desc', or '')
 * @returns {Function} returns.setSortOrder - Function to update the sort order
 * @returns {boolean} returns.showInStockOnly - Whether to show only products with stock > 0
 * @returns {Function} returns.setShowInStockOnly - Function to toggle stock filter
 * @returns {number} returns.currentPage - Current page number for pagination
 * @returns {Function} returns.setCurrentPage - Function to update current page
 * @returns {number} returns.productsPerPage - Number of products to show per page
 * @returns {Function} returns.setProductsPerPage - Function to update products per page
 * @returns {Array} returns.sortedProducts - Filtered and sorted array of products
 * 
 * @example
 * const { sortOrder, setSortOrder, sortedProducts } = useProductFilters(products);
 * 
 * // Set sorting to price ascending
 * setSortOrder('price_asc');
 * 
 * // Get filtered products
 * console.log('Filtered products:', sortedProducts);
 */
const useProductFilters = (initialProducts = []) => {
    // Sort order state: 'a-z', 'z-a', 'price_asc', 'price_desc', or empty string
    const [sortOrder, setSortOrder] = useState("");
    
    // Stock filter state: show only products with stock > 0
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    
    // Pagination state: current page number (1-based)
    const [currentPage, setCurrentPage] = useState(1);
    
    // Pagination state: number of products to display per page
    const [productsPerPage, setProductsPerPage] = useState(20);

    /**
     * Memoized filtered and sorted products
     * 
     * This computed value applies all active filters and sorting to the initial
     * products array. It's memoized to prevent unnecessary recalculations when
     * the dependencies (initialProducts, showInStockOnly, sortOrder) haven't changed.
     * 
     * @type {Array}
     */
    const filteredProducts = useMemo(() => {
        // Create a copy of the initial products to avoid mutating the original array
        let filtered = [...initialProducts];
        
        // Apply stock availability filter
        if (showInStockOnly) {
            filtered = filtered.filter((product) => product.stock > 0);
        }
        
        // Apply sorting based on the selected sort order
        if (sortOrder) {
            filtered.sort((a, b) => {
                switch (sortOrder) {
                    case 'a-z':
                        // Sort by name alphabetically (A to Z)
                        return a.name.localeCompare(b.name);
                    case 'z-a':
                        // Sort by name alphabetically (Z to A)
                        return b.name.localeCompare(a.name);
                    case 'price_asc':
                        // Sort by price ascending (low to high)
                        return a.price - b.price;
                    case 'price_desc':
                        // Sort by price descending (high to low)
                        return b.price - a.price;
                    default:
                        // No sorting applied
                        return 0;
                }
            });
        }
        
        return filtered;
    }, [initialProducts, showInStockOnly, sortOrder]);

    return {
        sortOrder,
        setSortOrder,
        showInStockOnly,
        setShowInStockOnly,
        currentPage,
        setCurrentPage,
        productsPerPage,
        setProductsPerPage,
        sortedProducts: filteredProducts
    };
};

export default useProductFilters;