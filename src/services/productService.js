import axiosInstance from './axios';
import { toast } from 'react-toastify';

const MAX_PAGE_SIZE = 100;

export const productService = {
    async getProducts(page = 1, pageSize = 20, search = '') {
        try {
            // Ensure pageSize doesn't exceed the maximum
            const validPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
            
            const response = await axiosInstance.get('/products/', {
                params: {
                    page,
                    page_size: validPageSize,
                    search
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error loading products. Please try again later.');
            throw error;
        }
    },

    async getProductById(id) {
        try {
            const response = await axiosInstance.get(`/products/${id}/`);
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
            
            const response = await axiosInstance.get('/products/', {
                params: {
                    ...filters,
                    page: filters.page || 1,
                    page_size: validPageSize
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