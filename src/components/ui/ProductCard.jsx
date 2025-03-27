import React from 'react';
import classes from '../../styles/ProductCard.module.css';

const Card = ({ name, description, image, price, stock, onAddToCart, onClick }) => {
  const handleAddToCart = () => {
    if (typeof onAddToCart === 'function') {
      onAddToCart();
    } else {
      console.error('onAddToCart no es una función');
    }
  };

  return (
    <div className={classes.product_card_container}>
      <div className={classes.product_card_image_container}>
        <img
          src={image}
          alt={name}
          className={classes.product_card_image}
        />
      </div>
      <div className={classes.product_card_details}>
        <h3 className={classes.product_card_name}>{name}</h3>
        <p className={classes.product_card_description}>{description}</p>
        <div className={`${classes.product_card_price_stock} mt-2`}>
          <p>Price: ${price}</p>
          <p>Stock: {stock}</p>
        </div>
        <div className={`${classes.product_card_button_container} mt-2`}>
          <div className='col'>

          </div>
          <div className='col'>
            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={classes.product_card_button}
            >
              {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
