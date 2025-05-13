import { ProductPrice, ProductActions } from './';
import classes from './ProductActionsContainer.module.css';

const ProductActionsContainer = ({ product }) => {
    return (
        <div className={classes.product_actions_container}>
            <ProductPrice price={product.price} stock={product.stock} />
            <ProductActions product={product} />
        </div>
    );
};

export default ProductActionsContainer;
