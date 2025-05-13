import classes from './ProductInfo.module.css';

const ProductInfo = ({ name, description }) => {
    return (
        <div className={`${classes.product_info}`}>
            <h1 className="custom_h1 mb-2">{name}</h1>
            <p>{description}</p>
        </div>
    );
};

export default ProductInfo; 