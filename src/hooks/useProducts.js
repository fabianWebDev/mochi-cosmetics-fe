/**
 * Products Hook
 * 
 * This hook provides a React-friendly interface for fetching and managing product data.
 * It handles product retrieval from the backend API with support for search, filtering,
 * pagination, and category-based browsing. The hook automatically updates when URL
 * parameters change, making it perfect for product listing pages.
 * 
 * Key Features:
 * - Automatic product fetching based on URL parameters
 * - Search functionality with query parameters
 * - Category-based product filtering
 * - Pagination support with configurable page size
 * - Product sorting options
 * - Loading and error state management
 * - Reactive updates when URL changes
 * 
 * @module useProducts
 * @requires react - React hooks for state management and effects
 * @requires react-router-dom - Location hook for URL parameter access
 * @requires productService - Product service for API calls
 * 
 * @example
 * import useProducts from '../hooks/useProducts';
 * 
 * function ProductsPage() {
 *   const { products, loading, error, pagination } = useProducts();
 * 
 *   if (loading) return <div>Loading products...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {products.map(product => (
 *         <div key={product.id}>{product.name}</div>
 *       ))}
 *       <div>
 *         Page {pagination.currentPage} of {Math.ceil(pagination.count / 20)}
 *       </div>
 *     </div>
 *   );
 * }
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { productService } from "../services/productService";

/**
 * Custom hook for fetching and managing product data
 * 
 * This hook provides a reactive interface for product management, automatically
 * fetching products based on URL parameters including search terms, categories,
 * pagination, and sorting options. It handles loading states, error management,
 * and provides pagination information for UI components.
 * 
 * @returns {Object} Product state and data
 * @returns {Array} returns.products - Array of product objects from the API
 * @returns {boolean} returns.loading - Whether products are currently being fetched
 * @returns {string|null} returns.error - Error message if fetch failed, null if no error
 * @returns {Object} returns.pagination - Pagination information object
 * @returns {number} returns.pagination.count - Total number of products available
 * @returns {string|null} returns.pagination.next - URL for next page, null if no next page
 * @returns {string|null} returns.pagination.previous - URL for previous page, null if no previous page
 * @returns {number} returns.pagination.currentPage - Current page number (1-based)
 * 
 * @example
 * const { products, loading, error, pagination } = useProducts();
 * 
 * // Check if products are loading
 * if (loading) {
 *   return <div>Loading products...</div>;
 * }
 * 
 * // Handle error state
 * if (error) {
 *   return <div>Error loading products: {error}</div>;
 * }
 * 
 * // Display products
 * return (
 *   <div>
 *     {products.map(product => (
 *       <ProductCard key={product.id} product={product} />
 *     ))}
 *     <Pagination 
 *       currentPage={pagination.currentPage}
 *       totalCount={pagination.count}
 *       hasNext={!!pagination.next}
 *       hasPrevious={!!pagination.previous}
 *     />
 *   </div>
 * );
 */
const useProducts = () => {
    // Array of product objects fetched from the API
    const [products, setProducts] = useState([]);
    
    // Loading state to indicate when products are being fetched
    const [loading, setLoading] = useState(true);
    
    // Error message if product fetching fails
    const [error, setError] = useState(null);
    
    // Pagination information including count, navigation URLs, and current page
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1
    });
    
    // React Router location object to access URL parameters
    const location = useLocation();

    /**
     * Effect hook that fetches products when URL parameters change
     * 
     * This effect automatically triggers when the location.search changes,
     * extracting URL parameters for search, category, pagination, and sorting.
     * It calls the appropriate product service method based on whether a
     * category filter is present and updates the component state accordingly.
     */
    useEffect(() => {
        /**
         * Fetches products from the API based on current URL parameters
         * 
         * This async function extracts search parameters from the URL and
         * calls the appropriate product service method. It handles both
         * general product searches and category-specific product searches,
         * updating the component state with the results or error information.
         * 
         * @async
         * @function fetchProducts
         * @returns {Promise<void>}
         */
        const fetchProducts = async () => {
            // Extract URL parameters for product filtering and pagination
            const searchParams = new URLSearchParams(location.search);
            const searchTerm = searchParams.get("search");           // Search query string
            const categorySlug = searchParams.get("category");       // Category filter slug
            const page = parseInt(searchParams.get("page")) || 1;     // Page number (default: 1)
            const pageSize = parseInt(searchParams.get("page_size")) || 20; // Items per page (default: 20)
            const sortOrder = searchParams.get("ordering") || "";    // Sort order parameter

            try {
                let data;
                
                // Choose appropriate API method based on whether category filter is present
                if (categorySlug) {
                    // Fetch products filtered by category
                    data = await productService.searchProductsByCategory(categorySlug, page, pageSize, sortOrder);
                } else {
                    // Fetch products with optional search term
                    data = await productService.getProducts(page, pageSize, searchTerm, sortOrder);
                }

                // Update products state with API response data
                setProducts(data.results || []);
                
                // Update pagination state with API response metadata
                setPagination({
                    count: data.count || 0,        // Total number of products
                    next: data.next,               // URL for next page (null if no next page)
                    previous: data.previous,       // URL for previous page (null if no previous page)
                    currentPage: page              // Current page number
                });
                
                // Mark loading as complete
                setLoading(false);
            } catch (err) {
                // Handle API errors by setting error message and stopping loading
                setError("Error fetching products");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    // Return hook state and data for component consumption
    return { products, loading, error, pagination };
};

export default useProducts;