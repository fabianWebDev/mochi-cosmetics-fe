import React from 'react';
import { MEDIA_BASE_URL } from '../../constants';
import classes from '../../styles/CartItem.module.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="row mb-4 align-items-center">
            <div className="col-md-2 d-flex justify-content-center">
                <img src={`${MEDIA_BASE_URL}/${item.product.image}`} alt={item.product.name} className={`${classes.cart_item_image}`} />
            </div>
            <div className="col-md-4">
                <h5>{item.product.name}</h5>
                <p className="text-muted mb-0">${item.product.price}</p>
            </div>
            <div className="col-md-3">
                <div className="input-group">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.product.id, parseInt(e.target.value))}
                        min="1"
                        max={item.product.stock}
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="col-md-2">
                <p className="h5 mb-0">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
            <div className="col-md-1">
                <button className="btn btn-outline-danger btn-sm" onClick={() => onRemove(item.product.id)}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        </div>
    );
};


export default CartItem;