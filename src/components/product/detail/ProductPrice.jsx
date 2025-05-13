import classes from './ProductPrice.module.css';

const ProductPrice = ({ price, stock }) => {
    return (
        <div className={classes.price_container}>
            <p className="">
                <span className={classes.product_price}>${price}</span>
            </p>
            {stock > 0 && (
                <p className={classes.in_stock}>In Stock</p>
            )}
            {stock === 0 && (
                <p className={classes.out_of_stock}>Out of Stock</p>
            )}
        </div>
    );
};

export default ProductPrice; 