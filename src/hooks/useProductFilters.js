import { useState, useEffect } from "react";

const useProductFilters = (products) => {
    const [sortOrder, setSortOrder] = useState("");
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 6;

    const sortedProducts = () => {
        let filteredProducts = [...products];

        if (showInStockOnly) {
            filteredProducts = filteredProducts.filter((product) => product.stock > 0);
        }

        switch (sortOrder) {
            case "a-z":
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "z-a":
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "price_asc":
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        return filteredProducts;
    };

    const paginatedProducts = sortedProducts().slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    useEffect(() => {
        setTotalProducts(sortedProducts().length);
    }, [products, sortOrder, showInStockOnly]);

    return {
        sortOrder,
        setSortOrder,
        showInStockOnly,
        setShowInStockOnly,
        currentPage,
        setCurrentPage,
        totalProducts,
        productsPerPage,
        paginatedProducts,
    };
};

export default useProductFilters;