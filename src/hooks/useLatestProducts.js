import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useLatestProducts = (limit = 4) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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