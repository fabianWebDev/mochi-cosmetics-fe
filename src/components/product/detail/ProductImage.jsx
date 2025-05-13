import { MEDIA_BASE_URL } from '../../../constants';
import classes from './ProductImage.module.css';

const ProductImage = ({ image, name }) => {
    return (
        <div className={classes.product_image}>
            <img 
                src={`${MEDIA_BASE_URL}${image}`} 
                alt={name}
                loading="lazy"
            />
        </div>
    );
};

export default ProductImage; 