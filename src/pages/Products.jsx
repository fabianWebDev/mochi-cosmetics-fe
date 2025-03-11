import { useState, useEffect } from 'react'
import axios from 'axios'

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products/');
                setProducts(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        {/* Add more product details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;
