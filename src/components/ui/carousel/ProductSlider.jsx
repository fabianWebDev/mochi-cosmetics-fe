import React from 'react';
import Slider from 'react-slick';
import Card from '../../product/ProductCard';
import { MEDIA_BASE_URL } from '../../../constants';
import { carouselSettings } from './carouselSettings';

const ProductSlider = ({ products, onViewDetails, onAddToCart, addingToCart }) => {
    return (
        <Slider {...carouselSettings}>
            {products.map((product) => (
                <div key={product.id} className="px-1">
                    <Card 
                        name={product.name}
                        description={product.description}
                        image={product.image ? `${MEDIA_BASE_URL}${product.image}` : ''}
                        price={product.price}
                        stock={product.stock}
                        onClick={() => onViewDetails(product.id)}
                        onAddToCart={() => onAddToCart(product)}
                        isAdding={addingToCart[product.id]}
                    />
                </div>
            ))}
        </Slider>
    );
};

export default ProductSlider; 