import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Card from '../components/ui/Card'
import { toast } from 'react-toastify'

const BASE_URL = 'http://127.0.0.1:8000';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/products/`);
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (product) => {
        const savedCart = localStorage.getItem('cart');
        const cart = savedCart ? JSON.parse(savedCart) : { items: [] };
        
        const existingItem = cart.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            // If item exists and adding one more wouldn't exceed stock
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
                toast.success('Added one more to cart!');
            } else {
                toast.warning('Maximum stock reached for this item');
                return;
            }
        } else {
            // Add new item
            cart.items.push({
                product: product,
                quantity: 1
            });
            toast.success('Product added to cart!');
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error) return <div className="container mt-4">{error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Products</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map((product) => (
                    <div key={product.id} className="col">
                        <Card
                            name={product.name}
                            description={product.description}
                            image={product.image ? `${BASE_URL}${product.image}` : ''}
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
