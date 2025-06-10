import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { productService } from "../services/productService";

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1
    });
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            const searchParams = new URLSearchParams(location.search);
            const searchTerm = searchParams.get("search");
            const page = parseInt(searchParams.get("page")) || 1;
            const pageSize = parseInt(searchParams.get("page_size")) || 20;
            const sortOrder = searchParams.get("ordering") || "";

            console.log('Search params:', {
                searchTerm,
                page,
                pageSize,
                sortOrder,
                fullUrl: location.search
            });

            try {
                const data = await productService.getProducts(page, pageSize, searchTerm, sortOrder);
                console.log('API Response:', data);

                // Handle the paginated response from Django
                setProducts(data.results || []);
                setPagination({
                    count: data.count || 0,
                    next: data.next,
                    previous: data.previous,
                    currentPage: page
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError("Error al cargar los productos");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    return { products, loading, error, pagination };
};

export default useProducts;