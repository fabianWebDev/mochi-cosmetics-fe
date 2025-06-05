import { useState, useEffect, useMemo } from "react";

const useProductFilters = (products = []) => {
    const [sortOrder, setSortOrder] = useState("");
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const productsPerPage = 6;

    // Ensure products is an array and handle null/undefined cases
    const productsArray = useMemo(() => {
        if (!products) return [];
        return Array.isArray(products) ? products : [];
    }, [products]);

    const sortedProducts = useMemo(() => {
        let filteredProducts = [...productsArray];

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
    }, [productsArray, sortOrder, showInStockOnly]);

    const paginatedProducts = useMemo(() => {
        return sortedProducts.slice(
            (currentPage - 1) * productsPerPage,
            currentPage * productsPerPage
        );
    }, [sortedProducts, currentPage, productsPerPage]);

    useEffect(() => {
        setTotalProducts(sortedProducts.length);
    }, [sortedProducts]);

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