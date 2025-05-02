import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useLatestProducts } from '../../../hooks/useLatestProducts';
import ProductSlider from './ProductSlider';

const ProductCarousel = () => {
    const { products, loading, error } = useLatestProducts();

    const handleViewDetails = (productId) => {
        // Implementar la lógica para ver detalles del producto
        console.log('Viewing product:', productId);
    };

    const handleAddToCart = (product) => {
        // Implementar la lógica para agregar al carrito
        console.log('Adding to cart:', product);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading products</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Latest Products</h2>
            <ProductSlider 
                products={products}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default ProductCarousel; 