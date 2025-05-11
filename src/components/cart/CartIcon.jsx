import { FiShoppingCart } from "react-icons/fi";
import classes from './CartIcon.module.css';

const CartIcon = ({ itemCount, className }) => {
  return (
    <div className={`${classes.cart_icon} ${className}`}>
      <FiShoppingCart />
      {itemCount > 0 && (
        <span className={classes.cart_count}>
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;