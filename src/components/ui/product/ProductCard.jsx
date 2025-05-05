import React from 'react';
import classes from './ProductCard.module.css';
import Button from '../common/Button';

const Card = ({ name, description, image, price, stock, onAddToCart, onClick, isAdding }) => {
  const handleAddToCart = () => {
    onAddToCart();
  };

  return (
    <div className={classes.product_card_container}>
      <div className={classes.product_card_image_container}>
        <img
          src={image}
          alt={name}
          className={classes.product_card_image}
          onClick={onClick}
        />
      </div>
      <div className={`${classes.product_card_details} mt-2`}>
        <h3 className={classes.product_card_name} onClick={onClick}>{name}</h3>
        <p className={classes.product_card_description}>{description}</p>
        <div className={`${classes.product_card_price_stock}`}>
          <p className={classes.product_card_price}>${price}</p>
          <p className={classes.stock}>Stock: <span className={classes.stock_span}>{stock}</span></p>
        </div>
        <div className={`${classes.product_card_button_container} mt-3`}>
          <Button
            onClick={handleAddToCart}
            disabled={stock === 0 || isAdding}
          >
            {stock === 0 ? 'Out of stock' : isAdding ? 'Adding...' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
