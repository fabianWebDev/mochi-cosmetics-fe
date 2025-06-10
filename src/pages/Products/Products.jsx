import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { cartService } from "../../services/cartService";
import useProducts from "../../hooks/useProducts";
import useProductFilters from "../../hooks/useProductFilters";
import { UI, Layout } from '../../components';
const { Common: { Pagination }, Product: { ProductList } } = UI;
const { SideBar } = Layout;
import { useState, useCallback } from "react";

const Products = () => {
    const navigate = useNavigate();
    const { products, loading, error, pagination } = useProducts();
    const {
        setSortOrder,
        showInStockOnly,
        setShowInStockOnly,
        currentPage,
        setCurrentPage,
        productsPerPage,
        setProductsPerPage,
        sortedProducts,
    } = useProductFilters(products);

    const [addingToCart, setAddingToCart] = useState({});

    const handleViewDetails = useCallback((slug) => {
        navigate(`/product/${slug}`);
    }, [navigate]);

    const handlePageSizeChange = useCallback((newSize) => {
        setProductsPerPage(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
        // Update URL with new page size
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page_size', newSize);
        searchParams.set('page', '1');
        navigate(`?${searchParams.toString()}`);
    }, [setProductsPerPage, setCurrentPage, navigate]);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
        // Update URL with new page
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', newPage);
        navigate(`?${searchParams.toString()}`);
    }, [setCurrentPage, navigate]);

    const handleSortChange = useCallback((e) => {
        const newSortOrder = e.target.value;
        setSortOrder(newSortOrder);
        // Update URL with new sort order
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('ordering', newSortOrder);
        searchParams.set('page', '1'); // Reset to first page when changing sort
        navigate(`?${searchParams.toString()}`);
    }, [setSortOrder, navigate]);

    const handleAddToCart = useCallback(async (product) => {
        if (addingToCart[product.id]) return;

        setAddingToCart(prev => ({ ...prev, [product.id]: true }));
        toast.dismiss();
        try {
            await cartService.addToCart(product.id, 1);
            toast.success(
                <div>
                    {product.name} added to cart!
                    <Link to="/cart" style={{ marginLeft: "5px", color: "#007bff" }}>
                        Go to cart
                    </Link>
                </div>
            );
            // Wait 1.5 seconds before allowing another addition
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            const message = error.response?.data?.error === "Not enough stock available"
                ? "Sorry, this product is out of stock"
                : "Error adding product to cart";
            toast.dismiss();
            toast.error(message);
        } finally {
            setAddingToCart(prev => ({ ...prev, [product.id]: false }));
        }
    }, [addingToCart]);

    if (loading) return <div className="mt-4">Loading...</div>;
    if (error) return <div className="mt-4">{error}</div>;

    return (
        <div className="row">
            <div className="col-md-3 mt-3 px-1">
                <SideBar
                    onSortChange={handleSortChange}
                    onStockFilterChange={(e) => setShowInStockOnly(e.target.checked)}
                    showInStockOnly={showInStockOnly}
                />
            </div>
            <div className="col-md-9">
                <ProductList
                    products={sortedProducts}
                    handleViewDetails={handleViewDetails}
                    handleAddToCart={handleAddToCart}
                    addingToCart={addingToCart}
                />
                <Pagination
                    currentPage={currentPage}
                    totalItems={pagination.count}
                    itemsPerPage={productsPerPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
};

export default Products;
