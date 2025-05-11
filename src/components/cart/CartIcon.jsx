import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { cartService } from '../../services/cartService';
import { eventService } from '../../services/eventService';
import classes from './CartIcon.module.css';

const CartIcon = ({
  itemCount: staticItemCount,
  className,
  useDynamicCount = false,
  linkToCart = false
}) => {
  const [dynamicCount, setDynamicCount] = useState(0);
  const count = useDynamicCount ? dynamicCount : staticItemCount;

  useEffect(() => {
    if (useDynamicCount) {
      const fetchCartCount = async () => {
        const count = await cartService.getCartCount();
        setDynamicCount(count);
      };
      fetchCartCount();

      const unsubscribe = eventService.subscribe('cartUpdated', (count) => {
        setDynamicCount(count);
      });

      return () => unsubscribe();
    }
  }, [useDynamicCount]);

  const iconContent = (
    <div className={`${classes.cart_icon} ${className}`}>
      <FiShoppingCart />
      {count > 0 && (
        <span className={classes.cart_count}>
          {count}
        </span>
      )}
    </div>
  );

  if (linkToCart) {
    return <Link to="/cart">{iconContent}</Link>;
  }

  return iconContent;
};

export default CartIcon;