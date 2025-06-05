import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { productService } from "../services/productService";

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            const searchParams = new URLSearchParams(location.search);
            const searchTerm = searchParams.get("search");

            try {
                const data = searchTerm
                    ? await productService.searchProducts({ search: searchTerm })
                    : await productService.getProducts();

                // Handle the paginated response from Django
                setProducts(data.results || []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError("Error al cargar los productos");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    return { products, loading, error };
};

export default useProducts;