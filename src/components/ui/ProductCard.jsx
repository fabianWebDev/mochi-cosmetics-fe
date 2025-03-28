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
      <div className={classes.product_card_image_container} onClick={onClick}>
        <img
          src={image}
          alt={name}
          className={classes.product_card_image}
        />
      </div>
      <div className={`${classes.product_card_details} mt-2`}>
        <h3 className={classes.product_card_name} onClick={onClick}>{name}</h3>
        <p className={classes.product_card_description}>{description}</p>
        <div className={`${classes.product_card_price_stock}`}>
          <p>${price}</p>
          <p>Stock: <span>{stock}</span></p>
        </div>
        <div className={`${classes.product_card_button_container} mt-3`}>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`${classes.product_card_button} ${stock === 0 ? classes.product_card_button_disabled : ''}`}
          >
            {stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
