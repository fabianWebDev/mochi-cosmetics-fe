import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../../../services/cartService';
import Button from '../../../components/ui/common/Button';
import classes from './ProductActions.module.css';

const ProductActions = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

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
            setQuantity(1);
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

    return (
        <div className={`${classes.product_actions}`}>
            <div className={classes.quantity_control}>
                <p>Quantity:</p>
                <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className={classes.quantity_select}
                    disabled={product.stock === 0}
                >
                    {[...Array(product.stock)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>
            <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
            >
                {product.stock === 0 ? 'Out of stock' : isAddingToCart ? 'Adding...' : 'Add to cart'}
            </Button>
        </div>
    );
};

export default ProductActions; 