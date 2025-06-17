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
            const categorySlug = searchParams.get("category");
            const page = parseInt(searchParams.get("page")) || 1;
            const pageSize = parseInt(searchParams.get("page_size")) || 20;
            const sortOrder = searchParams.get("ordering") || "";

            console.log('Search params:', {
                searchTerm,
                categorySlug,
                page,
                pageSize,
                sortOrder,
                fullUrl: location.search
            });

            try {
                let data;
                if (categorySlug) {
                    // If category is specified, use searchProductsByCategory
                    data = await productService.searchProductsByCategory(categorySlug, page, pageSize, sortOrder);
                } else {
                    // Otherwise use regular product search
                    data = await productService.getProducts(page, pageSize, searchTerm, sortOrder);
                }

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
                setError("Error fetching products");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    return { products, loading, error, pagination };
};

export default useProducts;