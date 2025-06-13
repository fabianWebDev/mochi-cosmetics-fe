import { useNavigate } from 'react-router-dom';
import classes from './CaregoryCard.module.css';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
        navigate(`/products?category=${categorySlug}`);
    };

    return (
        <div
            className={`${classes.card_container} card mb-2`}
            onClick={handleClick}
            style={{
                backgroundImage: `url(${category.image})`
            }}
        >
            <div className={classes.overlay_container}>
                <h3 className={classes.card_title}>{category.name}</h3>
            </div>
        </div>
    );
};

export default CategoryCard;