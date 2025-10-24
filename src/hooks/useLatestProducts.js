/**
 * Latest Products Hook
 * 
 * This hook provides a React-friendly interface for fetching and managing
 * the latest products from the store. It handles loading states, error
 * management, and provides a clean API for components that need to display
 * the most recent products.
 * 
 * Key Features:
 * - Fetches latest products from the API
 * - Configurable product limit
 * - Loading state management
 * - Error handling and reporting
 * - Automatic data fetching on mount and limit changes
 * 
 * @module useLatestProducts
 * @requires react - React hooks for state management
 * @requires productService - Product service for API calls
 * 
 * @example
 * import { useLatestProducts } from '../hooks/useLatestProducts';
 * 
 * function LatestProductsComponent() {
 *   const { products, loading, error } = useLatestProducts(6);
 * 
 *   if (loading) return <div>Loading latest products...</div>;
 *   if (error) return <div>Error loading products</div>;
 * 
 *   return (
 *     <div>
 *       {products.map(product => (
 *         <div key={product.id}>
 *           {product.name} - ${product.price}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */

import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

/**
 * Custom hook for fetching and managing latest products
 * 
 * This hook provides a reactive interface to fetch the latest products
 * from the store. It automatically loads products when the component mounts
 * and re-fetches when the limit parameter changes. The hook manages loading
 * states and error handling to provide a smooth user experience.
 * 
 * @param {number} [limit=4] - Maximum number of latest products to fetch
 * @returns {Object} Latest products state and data
 * @returns {Array} returns.products - Array of latest product objects
 * @returns {boolean} returns.loading - Whether products are currently being fetched
 * @returns {Error|null} returns.error - Error object if fetch failed, null otherwise
 * 
 * @example
 * const { products, loading, error } = useLatestProducts(8);
 * 
 * // Check loading state
 * if (loading) {
 *   return <div>Loading latest products...</div>;
 * }
 * 
 * // Handle error state
 * if (error) {
 *   console.error('Failed to load latest products:', error);
 *   return <div>Error loading products</div>;
 * }
 * 
 * // Use products data
 * console.log('Latest products:', products);
 */
export const useLatestProducts = (limit = 4) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        /**
         * Fetches the latest products from the API
         * 
         * This function calls the productService to retrieve the most recent
         * products based on the specified limit. It handles both successful
         * responses and errors, updating the hook's state accordingly.
         * 
         * @async
         * @returns {Promise<void>}
         */
        const fetchLatestProducts = async () => {
            try {
                const data = await productService.getLatestProducts(limit);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching latest products:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, [limit]);

    return { products, loading, error };
}; 