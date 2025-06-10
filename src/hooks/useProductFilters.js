import { useState, useMemo } from "react";

const useProductFilters = (initialProducts = []) => {
    const [sortOrder, setSortOrder] = useState("");
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(20);

    const filteredProducts = useMemo(() => {
        let filtered = [...initialProducts];
        
        // Apply stock filter
        if (showInStockOnly) {
            filtered = filtered.filter((product) => product.stock > 0);
        }
        
        // Apply sorting
        if (sortOrder) {
            filtered.sort((a, b) => {
                switch (sortOrder) {
                    case 'a-z':
                        return a.name.localeCompare(b.name);
                    case 'z-a':
                        return b.name.localeCompare(a.name);
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    default:
                        return 0;
                }
            });
        }
        
        return filtered;
    }, [initialProducts, showInStockOnly, sortOrder]);

    return {
        sortOrder,
        setSortOrder,
        showInStockOnly,
        setShowInStockOnly,
        currentPage,
        setCurrentPage,
        productsPerPage,
        setProductsPerPage,
        sortedProducts: filteredProducts
    };
};

export default useProductFilters;