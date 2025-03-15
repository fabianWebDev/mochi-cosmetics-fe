import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import { cartService } from '../services/cartService';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import { MEDIA_BASE_URL } from '../constants'

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="product-detail">
            <Card
                name={product.name}
                description={product.description}
                image={`${MEDIA_BASE_URL}${product.image}`}
                price={product.price}
                stock={product.stock}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default Product;
