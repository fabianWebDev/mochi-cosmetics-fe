import React from 'react';

const Card = ({ name, description, image, price, stock }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img src={image} alt={name} className="card-img-top img-fluid p-3" style={{ width: '200px' }} />
      <div className="card-body">
        <h2 className="card-title h5 mb-3">{name}</h2>
        <p className="card-text text-muted">{description}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <p className="h5 text-primary mb-0">Price: ${price}</p>
          <span className="badge bg-secondary">Stock: {stock}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
