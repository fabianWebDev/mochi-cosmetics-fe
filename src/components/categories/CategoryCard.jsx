import { useNavigate } from 'react-router-dom';
import classes from './CaregoryCard.module.css';
import { MEDIA_BASE_URL } from '../../constants';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products?search=${encodeURIComponent(category.name)}`);
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