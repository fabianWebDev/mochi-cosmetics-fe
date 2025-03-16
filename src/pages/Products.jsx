import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import { toast } from 'react-toastify'
import { cartService } from '../services/cartService'
import { productService } from '../services/productService'
import { MEDIA_BASE_URL } from '../constants'

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            const searchParams = new URLSearchParams(location.search);
            const searchTerm = searchParams.get('search');

            try {
                let data;
                if (searchTerm) {
                    data = await productService.searchProducts(searchTerm);
                } else {
                    data = await productService.getProducts();
                }
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los productos');
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, [location.search]);

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = async (product) => {
        try {
            await cartService.addToCart(product.id, 1);
            toast.success('Producto agregado al carrito!');
        } catch (error) {
            if (error.response?.data?.error === 'Not enough stock available') {
                toast.error('Lo sentimos, este producto está agotado');
            } else {
                toast.error('Error al agregar el producto al carrito');
            }
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) return <div className="container mt-4">Cargando...</div>;
    if (error) return <div className="container mt-4">{error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Productos</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map((product) => (
                    <div key={product.id} className="col">
                        <Card
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
        </div>
    );
}

export default Products;
