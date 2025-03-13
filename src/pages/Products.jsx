import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Card from '../components/ui/Card'

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} onClick={() => handleViewDetails(product.id)} style={{ cursor: 'pointer' }}>
                        <Card
                            name={product.name}
                            description={product.description}
                            image={product.image ? `${BASE_URL}${product.image}` : ''}
                            price={product.price}
                            stock={product.stock}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;
