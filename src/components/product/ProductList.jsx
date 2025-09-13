import React from 'react';
import Card from './ProductCard';
import classes from './ProductList.module.css';

const ProductList = ({ products, handleViewDetails, handleAddToCart, addingToCart }) => {
    return (
        <div className={classes.product_list_container}>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3">
                {products.map((product) => (
                    <div key={product.id} className="col p-0">
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
        </div>
    );
};

export default ProductList;