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

            try {
                let data;
                if (categorySlug) {
                    data = await productService.searchProductsByCategory(categorySlug, page, pageSize, sortOrder);
                } else {
                    data = await productService.getProducts(page, pageSize, searchTerm, sortOrder);
                }

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