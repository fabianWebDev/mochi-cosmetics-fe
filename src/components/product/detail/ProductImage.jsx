import classes from './ProductImage.module.css';

const ProductImage = ({ image, name }) => {
    return (
        <div className={classes.product_image}>
            <img
                src={`${image}`}
                alt={name}
                loading="lazy"
            />
        </div>
    );
};

export default ProductImage; 