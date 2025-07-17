/**
 * Product Service
 * 
 * This service handles all product-related operations including product retrieval,
 * search, filtering, and category management. It provides a centralized interface
 * for product operations with support for pagination, sorting, and search functionality.
 * 
 * Key Features:
 * - Product listing with pagination and sorting
 * - Product search and filtering
 * - Category-based product filtering
 * - Latest products retrieval
 * - Category management
 * - Comprehensive error handling with user notifications
 * 
 * @module productService
 * @requires axiosInstance - Configured axios instance for API calls
 * @requires react-toastify - For user notifications
 * @example
 * import { productService } from './productService';
 * 
 * // Get products with pagination and sorting
 * const products = await productService.getProducts(1, 20, '', 'price_asc');
 * 
 * // Search products by category
 * const categoryProducts = await productService.searchProductsByCategory('electronics');
 */

import axiosInstance from './axios';
import { toast } from 'react-toastify';

/**
 * Maximum allowed page size for product queries
 * 
 * Prevents excessive data loading and improves performance
 * by limiting the number of products that can be requested at once.
 * 
 * @type {number}
 * @constant
 */
const MAX_PAGE_SIZE = 100;

/**
 * Product service object containing all product-related methods
 * 
 * @type {Object}
 */
export const productService = {
    /**
     * Retrieves products with pagination, search, and sorting options
     * 
     * Fetches products from the backend with support for pagination, text search,
     * and various sorting options. Automatically validates and limits page size
     * to prevent performance issues.
     * 
     * @async
     * @param {number} [page=1] - Page number for pagination
     * @param {number} [pageSize=20] - Number of products per page (max 100)
     * @param {string} [search=''] - Search term to filter products by name
     * @param {string} [sortOrder=''] - Sorting order ('a-z', 'z-a', 'price_asc', 'price_desc')
     * @returns {Promise<Object>} Object containing products and pagination info
     * @throws {Error} When products cannot be retrieved
     * 
     * @example
     * try {
     *   const result = await productService.getProducts(1, 20, 'laptop', 'price_asc');
     *   console.log('Products:', result.results);
     *   console.log('Total pages:', result.total_pages);
     * } catch (error) {
     *   console.error('Failed to get products:', error.message);
     * }
     */
    async getProducts(page = 1, pageSize = 20, search = '', sortOrder = '') {
        try {
            // Ensure pageSize doesn't exceed the maximum
            const validPageSize = Math.min(pageSize, MAX_PAGE_SIZE);

            // Map frontend sort values to Django ordering
            let ordering = '';
            switch (sortOrder) {
                case 'a-z':
                    ordering = 'name';
                    break;
                case 'z-a':
                    ordering = '-name';
                    break;
                case 'price_asc':
                    ordering = 'price';
                    break;
                case 'price_desc':
                    ordering = '-price';
                    break;
                default:
                    ordering = '';
            }

            const response = await axiosInstance.get('/products/', {
                params: {
                    page,
                    page_size: validPageSize,
                    search,
                    ordering
                }
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            toast.error('Error loading products. Please try again later.');
            throw error;
        }
    },

    /**
     * Retrieves detailed information about a specific product
     * 
     * Fetches complete product details including images, specifications,
     * pricing, and availability information.
     * 
     * @async
     * @param {string|number} identifier - Product ID or slug identifier
     * @returns {Promise<Object>} Complete product object with all details
     * @throws {Error} When product cannot be found or retrieved
     * 
     * @example
     * try {
     *   const product = await productService.getProduct('laptop-dell-xps-13');
     *   console.log('Product details:', product);
     * } catch (error) {
     *   console.error('Failed to get product:', error.message);
     * }
     */
    async getProduct(identifier) {
        try {
            const response = await axiosInstance.get(`/products/${identifier}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Error loading product details. Please try again later.');
            throw error;
        }
    },

    /**
     * Searches products using advanced filters
     * 
     * Performs a comprehensive product search with multiple filter options
     * including category, price range, and other product attributes.
     * 
     * @async
     * @param {Object} filters - Search and filter parameters
     * @param {number} [filters.page=1] - Page number for pagination
     * @param {number} [filters.pageSize=20] - Number of products per page
     * @param {string} [filters.search] - Search term for product names
     * @param {string} [filters.category] - Category slug to filter by
     * @param {string} [filters.sortOrder] - Sorting order
     * @param {number} [filters.minPrice] - Minimum price filter
     * @param {number} [filters.maxPrice] - Maximum price filter
     * @returns {Promise<Object>} Object containing filtered products and pagination info
     * @throws {Error} When search operation fails
     * 
     * @example
     * try {
     *   const result = await productService.searchProducts({
     *     page: 1,
     *     pageSize: 20,
     *     search: 'wireless',
     *     category: 'electronics',
     *     sortOrder: 'price_asc',
     *     minPrice: 50,
     *     maxPrice: 200
     *   });
     *   console.log('Search results:', result.results);
     * } catch (error) {
     *   console.error('Search failed:', error.message);
     * }
     */
    async searchProducts(filters) {
        try {
            // Ensure pageSize doesn't exceed the maximum
            const validPageSize = Math.min(filters.pageSize || 20, MAX_PAGE_SIZE);

            // Map frontend sort values to Django ordering
            let ordering = '';
            switch (filters.sortOrder) {
                case 'a-z':
                    ordering = 'name';
                    break;
                case 'z-a':
                    ordering = '-name';
                    break;
                case 'price_asc':
                    ordering = 'price';
                    break;
                case 'price_desc':
                    ordering = '-price';
                    break;
                default:
                    ordering = '';
            }

            const response = await axiosInstance.get('/products/', {
                params: {
                    ...filters,
                    page: filters.page || 1,
                    page_size: validPageSize,
                    ordering
                }
            });
            return response.data;
        } catch (error) {
            toast.error('Error searching products. Please try again later.');
            throw error;
        }
    },

    /**
     * Retrieves product categories with pagination
     * 
     * Fetches available product categories. For authenticated users, returns
     * all categories; for guest users, attempts to fetch public categories
     * if the authenticated request fails.
     * 
     * @async
     * @param {number} [page=1] - Page number for pagination
     * @param {number} [pageSize=10] - Number of categories per page
     * @returns {Promise<Object>} Object containing categories and pagination info
     * @throws {Error} When categories cannot be retrieved
     * 
     * @example
     * try {
     *   const result = await productService.getCategories(1, 20);
     *   console.log('Categories:', result.results);
     * } catch (error) {
     *   console.error('Failed to get categories:', error.message);
     * }
     */
    async getCategories(page = 1, pageSize = 10) {
        try {
            const response = await axiosInstance.get('/categories/', {
                params: {
                    page,
                    page_size: pageSize
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    // Try to fetch public categories if authenticated request fails
                    const response = await axiosInstance.get('/categories/public/', {
                        params: {
                            page,
                            page_size: pageSize
                        }
                    });
                    return response.data;
                } catch (publicError) {
                    console.error('Error fetching public categories:', publicError);
                    toast.error('Error loading categories. Please try again later.');
                    throw publicError;
                }
            }
            console.error('Error fetching categories:', error);
            toast.error('Error loading categories. Please try again later.');
            throw error;
        }
    },

    /**
     * Retrieves the latest products for display on homepage or featured sections
     * 
     * Fetches recently added or updated products, typically used for
     * homepage carousels or featured product sections.
     * 
     * @async
     * @param {number} [limit=3] - Maximum number of latest products to retrieve
     * @returns {Promise<Array>} Array of latest products
     * @throws {Error} When latest products cannot be retrieved
     * 
     * @example
     * try {
     *   const latestProducts = await productService.getLatestProducts(5);
     *   console.log('Latest products:', latestProducts);
     * } catch (error) {
     *   console.error('Failed to get latest products:', error.message);
     * }
     */
    async getLatestProducts(limit = 3) {
        try {
            const response = await axiosInstance.get('products/latest/', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Retrieves products filtered by a specific category
     * 
     * Fetches products that belong to a specific category with support for
     * pagination and sorting. Useful for category-specific product listings.
     * 
     * @async
     * @param {string} categorySlug - Category slug identifier
     * @param {number} [page=1] - Page number for pagination
     * @param {number} [pageSize=20] - Number of products per page (max 100)
     * @param {string} [sortOrder=''] - Sorting order ('a-z', 'z-a', 'price_asc', 'price_desc')
     * @returns {Promise<Object>} Object containing category products and pagination info
     * @throws {Error} When category products cannot be retrieved
     * 
     * @example
     * try {
     *   const result = await productService.searchProductsByCategory(
     *     'electronics', 
     *     1, 
     *     20, 
     *     'price_asc'
     *   );
     *   console.log('Category products:', result.results);
     * } catch (error) {
     *   console.error('Failed to get category products:', error.message);
     * }
     */
    async searchProductsByCategory(categorySlug, page = 1, pageSize = 20, sortOrder = '') {
        try {
            // Ensure pageSize doesn't exceed the maximum
            const validPageSize = Math.min(pageSize, MAX_PAGE_SIZE);

            // Map frontend sort values to Django ordering
            let ordering = '';
            switch (sortOrder) {
                case 'a-z':
                    ordering = 'name';
                    break;
                case 'z-a':
                    ordering = '-name';
                    break;
                case 'price_asc':
                    ordering = 'price';
                    break;
                case 'price_desc':
                    ordering = '-price';
                    break;
                default:
                    ordering = '';
            }
            const response = await axiosInstance.get('/products/', {
                params: {
                    category: categorySlug,
                    page,
                    page_size: validPageSize,
                    ordering
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            toast.error('Error loading products. Please try again later.');
            throw error;
        }
    }
}; 