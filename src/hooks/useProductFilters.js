import { useState, useEffect, useMemo } from "react";
import { productService } from "../services/productService";

const useProductFilters = (initialProducts = []) => {
    const [sortOrder, setSortOrder] = useState("");
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(20);
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProducts(currentPage, productsPerPage, '', sortOrder);
                setProducts(data.results || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, productsPerPage, sortOrder]);

    const filteredProducts = useMemo(() => {
        if (showInStockOnly) {
            return products.filter((product) => product.stock > 0);
        }
        return products;
    }, [products, showInStockOnly]);

    return {
        sortOrder,
        setSortOrder,
        showInStockOnly,
        setShowInStockOnly,
        currentPage,
        setCurrentPage,
        productsPerPage,
        setProductsPerPage,
        sortedProducts: filteredProducts,
        loading
    };
};

export default useProductFilters;