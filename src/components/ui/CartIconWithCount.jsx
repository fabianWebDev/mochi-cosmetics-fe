import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { cartService } from '../../services/cartService';
import { eventService } from '../../services/eventService';
import classes from '../../styles/CartIcon.module.css';
import classes2 from '../../styles/CartIconWithCount.module.css';

const CartIconWithCount = ({ className }) => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            const count = await cartService.getCartCount();
            setCartCount(count);
        };
        fetchCartCount();

        const unsubscribe = eventService.subscribe('cartUpdated', (count) => {
            setCartCount(count);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <Link to="/cart">
            <div className={`${classes2.cart_icon} ${className}`}>
                <FiShoppingCart />
                {cartCount > 0 && (
                    <span className={classes.cart_count}>
                        {cartCount}
                    </span>
                )}
            </div>
        </Link>
    );
};

export default CartIconWithCount; 