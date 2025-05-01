import axiosInstance from './axios';

export const productService = {
    async getProducts() {
        try {
            const response = await axiosInstance.get('/products/');
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Si no está autenticado, intentar obtener productos sin autenticación
                const response = await axiosInstance.get('/products/public/');
                return response.data;
            }
            throw error;
        }
    },

    async getProductById(id) {
        try {
            const response = await axiosInstance.get(`/products/${id}/`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Si no está autenticado, intentar obtener producto sin autenticación
                const response = await axiosInstance.get(`/products/${id}/public/`);
                return response.data;
            }
            throw error;
        }
    },

    async searchProducts(filters) {
        try {
            const response = await axiosInstance.get('/products/', {
                params: filters
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                console.error('Unauthorized: No JWT token available.');
            }
            throw error;
        }
    },

    async getCategories() {
        try {
            const response = await axiosInstance.get('/categories/');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getLatestProducts(limit = 3) {
        try {
            const response = await axiosInstance.get('/products/latest/', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                const response = await axiosInstance.get('/products/latest/public/', {
                    params: { limit }
                });
                return response.data;
            }
            throw error;
        }
    }
}; 