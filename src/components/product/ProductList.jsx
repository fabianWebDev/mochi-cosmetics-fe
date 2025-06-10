import React from 'react';
import Card from './ProductCard';

const ProductList = ({ products, handleViewDetails, handleAddToCart, addingToCart }) => {
    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 mt-3">
            {products.map((product) => (
                <div key={product.id} className="col mb-2 px-1">
                    <Card
                        name={product.name}
                        description={product.description}
                        image={product.image ? `${product.image}` : ''}
                        price={product.price}
                        stock={product.stock}
                        onClick={() => handleViewDetails(product.slug)}
                        onAddToCart={() => handleAddToCart(product)}
                        isAdding={addingToCart[product.id]}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductList;