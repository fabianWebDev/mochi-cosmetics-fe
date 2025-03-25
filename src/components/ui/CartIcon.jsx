import { FaShoppingCart } from "react-icons/fa";
import classes from '../../styles/CartIcon.module.css';

const CartIcon = ({ itemCount }) => {
  return (
    <div className={classes.cart_icon}>
      <FaShoppingCart/>
      {itemCount > 0 && (
        <span className={classes.cart_count}>
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;