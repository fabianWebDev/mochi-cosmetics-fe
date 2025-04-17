import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { cartService } from "../services/cartService";
import useProducts from "../hooks/useProducts";
import useProductFilters from "../hooks/useProductFilters";
import { UI, Layout } from '../components';
const { Common: { Pagination }, Product: { ProductList } } = UI;
const { SideBar } = Layout;
import { useState } from "react";

const Products = () => {
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();
    const {
        setSortOrder,
        showInStockOnly,
        setShowInStockOnly,
        currentPage,
        setCurrentPage,
        totalProducts,
        productsPerPage,
        paginatedProducts,
    } = useProductFilters(products);

    const [addingToCart, setAddingToCart] = useState({});

    const handleViewDetails = (productId) => navigate(`/product/${productId}`);

    const handleAddToCart = async (product) => {
        if (addingToCart[product.id]) return;

        setAddingToCart(prev => ({ ...prev, [product.id]: true }));
        toast.dismiss();
        try {
            await cartService.addToCart(product.id, 1);
            toast.success(
                <div>
                    Producto agregado al carrito!
                    <Link to="/cart" style={{ marginLeft: "5px", color: "#007bff" }}>
                        Ir al carrito
                    </Link>
                </div>
            );
            // Wait 1.5 seconds before allowing another addition
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            const message = error.response?.data?.error === "Not enough stock available"
                ? "Lo sentimos, este producto está agotado"
                : "Error al agregar el producto al carrito";
            toast.dismiss();
            toast.error(message);
        } finally {
            setAddingToCart(prev => ({ ...prev, [product.id]: false }));
        }
    };

    if (loading) return <div className="mt-4">Cargando...</div>;
    if (error) return <div className="mt-4">{error}</div>;

    return (
        <div className="row">
            <div className="col-md-3 mt-3">
                <SideBar
                    onSortChange={(e) => setSortOrder(e.target.value)}
                    onStockFilterChange={(e) => setShowInStockOnly(e.target.checked)}
                    showInStockOnly={showInStockOnly}
                />
            </div>
            <div className="col-md-9">
                <ProductList
                    products={paginatedProducts}
                    handleViewDetails={handleViewDetails}
                    handleAddToCart={handleAddToCart}
                    addingToCart={addingToCart}
                />
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalProducts}
                    itemsPerPage={productsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Products;
