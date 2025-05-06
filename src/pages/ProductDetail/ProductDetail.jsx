import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { MEDIA_BASE_URL } from '../../constants'
import classes from './ProductDetail.module.css'
import Button from '../../components/ui/common/Button';

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
        toast.dismiss();
        try {
            await cartService.addToCart(product.id, quantity);
            toast.success(
                <div>
                    {product.name} added to cart!
                    <Link to="/cart" style={{ marginLeft: "5px", color: "#007bff" }}>
                        Go to cart
                    </Link>
                </div>
            );
            setQuantity(1); // Reset quantity after adding to cart
            // Wait 1.5 seconds before allowing another addition
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            const message = error.response?.data?.error === "Not enough stock available"
                ? "Sorry, this product is out of stock"
                : "Error adding product to cart";
            toast.dismiss();
            toast.error(message);
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
                <h1 className="custom_h1 mb-3">{product.name}</h1>
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
                    <Button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAddingToCart}
                    >
                        {product.stock === 0 ? 'Out of stock' : isAddingToCart ? 'Adding...' : 'Add to cart'}
                    </Button>
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
