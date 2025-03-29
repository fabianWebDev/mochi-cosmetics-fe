import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import { toast } from 'react-toastify'
import { cartService } from '../services/cartService'
import { productService } from '../services/productService'
import { MEDIA_BASE_URL } from '../constants'
import Pagination from '../components/ui/Pagination'
import Sidebar from '../components/layout/SideBar'

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const productsPerPage = 9;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            const searchParams = new URLSearchParams(location.search);
            const searchTerm = searchParams.get('search');

            try {
                let data;
                if (searchTerm) {
                    data = await productService.searchProducts({
                        search: searchTerm,
                    });
                } else {
                    data = await productService.getProducts();
                }
                setProducts(data);
                setTotalProducts(data.length); // Suponiendo que el servicio devuelve todos los productos
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los productos');
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, [location.search]);

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = async (product) => {
        try {
            await cartService.addToCart(product.id, 1);
            toast.success(
                <div>
                    Producto agregado al carrito!
                    <Link to="/cart" style={{ marginLeft: '5px', color: '#007bff', textDecoration: 'underline' }}>
                        Ir al carrito
                    </Link>
                </div>
            );
        } catch (error) {
            if (error.response?.data?.error === 'Not enough stock available') {
                toast.error('Lo sentimos, este producto está agotado');
            } else {
                toast.error('Error al agregar el producto al carrito');
            }
            console.error('Error adding to cart:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStockFilterChange = (e) => {
        setShowInStockOnly(e.target.checked);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const sortedProducts = () => {
        let sorted = [...products];

        // Apply stock filter
        if (showInStockOnly) {
            sorted = sorted.filter(product => product.stock > 0);
        }

        // Apply sorting
        if (sortOrder === 'alphabetical') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'price_asc') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price_desc') {
            sorted.sort((a, b) => b.price - a.price);
        }
        return sorted;
    };

    const paginatedProducts = sortedProducts().slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    // Update total products count when filters change
    useEffect(() => {
        setTotalProducts(sortedProducts().length);
    }, [products, sortOrder, showInStockOnly]);

    if (loading) return <div className="container mt-4">Cargando...</div>;
    if (error) return <div className="container mt-4">{error}</div>;

    return (
        <>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar onSortChange={handleSortChange}
                            onStockFilterChange={handleStockFilterChange}
                            showInStockOnly={showInStockOnly} />
                    </div>
                    <div className="col-md-9">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalProducts}
                            itemsPerPage={productsPerPage}
                            onPageChange={handlePageChange}
                        />
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3 mb-4">
                            {paginatedProducts.map((product) => (
                                <div key={product.id} className="col">
                                    <ProductCard
                                        name={product.name}
                                        description={product.description}
                                        image={product.image ? `${MEDIA_BASE_URL}${product.image}` : ''}
                                        price={product.price}
                                        stock={product.stock}
                                        onClick={() => handleViewDetails(product.id)}
                                        onAddToCart={() => handleAddToCart(product)}
                                    />
                                </div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalProducts}
                            itemsPerPage={productsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Products;
