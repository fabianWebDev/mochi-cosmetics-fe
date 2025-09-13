import { useNavigate } from 'react-router-dom';
import classes from './CaregoryCard.module.css';
import { MEDIA_BASE_URL } from '../../constants';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
        navigate(`/products?category=${categorySlug}`);
    };

    return (
        <div
            className={`${classes.card_container} card`}
            onClick={handleClick}
        >
            <img className={classes.card_image} src={MEDIA_BASE_URL + category.image} alt={category.name} />
            <div className={classes.overlay_container}>
                <h3 className={classes.card_title}>{category.name}</h3>
            </div>
        </div>
    );
};

export default CategoryCard;