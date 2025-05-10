import React from 'react';
import Card from './ProductCard';
import { MEDIA_BASE_URL } from '../../../constants';

const ProductList = ({ products, handleViewDetails, handleAddToCart, addingToCart }) => {
    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 mt-3 mb-4">
            {products.map((product) => (
                <div key={product.id} className="col mb-2 px-1">
                    <Card
                        name={product.name}
                        description={product.description}
                        image={product.image ? `${MEDIA_BASE_URL}${product.image}` : ''}
                        price={product.price}
                        stock={product.stock}
                        onClick={() => handleViewDetails(product.id)}
                        onAddToCart={() => handleAddToCart(product)}
                        isAdding={addingToCart[product.id]}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductList;