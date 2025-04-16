import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import { MEDIA_BASE_URL } from '../constants'
import classes from '../styles/ProductDetail.module.css'

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

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

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (isAddingToCart) return;

        setIsAddingToCart(true);
        try {
            await cartService.addToCart(product.id, quantity);
            toast.dismiss();
            toast.success('Producto agregado al carrito!');
            setQuantity(1); // Reset quantity after adding to cart
            // Wait 1 second before allowing another addition
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            if (error.response?.data?.error === 'Not enough stock available') {
                toast.error('Lo sentimos, este producto está agotado');
            } else {
                toast.error('Error al agregar el producto al carrito');
            }
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className={`${classes.product_detail} row mt-4`}>
            <div className={`${classes.product_image} col-md-4`}>
                <img src={`${MEDIA_BASE_URL}${product.image}`} alt={product.name} className="img-fluid" />
            </div>
            <div className={`${classes.product_info} col-md-4`}>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
            </div>
            <div className={`col-md-2`}>
                <div className={`${classes.product_actions} row`}>
                    <p className="text-center">
                        <span className={`${classes.product_price}`}>${product.price}</span>

                    </p>
                    <div className={classes.quantity_control}>
                        <button
                            className={classes.quantity_button}
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <span className={classes.quantity_value}>{quantity}</span>
                        <button
                            className={classes.quantity_button}
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.stock}
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAddingToCart}
                        className={`${classes.add_to_cart_button} ${product.stock === 0 ? classes.product_card_button_disabled : ''}`}
                    >
                        {product.stock === 0 ? 'Out of stock' : isAddingToCart ? 'Adding...' : 'Add to cart'}
                    </button>
                    <p className="text-center">
                        <span className={`${classes.product_stock}`}>Stock: {product.stock}</span>
                    </p>
                </div>
            </div>
            <div className={`col-md-2`}>

            </div>
        </div>
    );
};

export default ProductDetail;
