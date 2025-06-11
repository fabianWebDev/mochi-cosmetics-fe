import axiosInstance from './axios';
import { toast } from 'react-toastify';

const MAX_PAGE_SIZE = 100;

export const productService = {
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

            console.log('Making API request with params:', {
                page,
                page_size: validPageSize,
                search,
                ordering
            });
            
            const response = await axiosInstance.get('/products/', {
                params: {
                    page,
                    page_size: validPageSize,
                    search,
                    ordering
                }
            });

            console.log('API Response status:', response.status);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            toast.error('Error loading products. Please try again later.');
            throw error;
        }
    },

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
            console.error('Error searching products:', error);
            toast.error('Error searching products. Please try again later.');
            throw error;
        }
    },

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

    async getLatestProducts(limit = 3) {
        try {
            const response = await axiosInstance.get('products/latest/', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 