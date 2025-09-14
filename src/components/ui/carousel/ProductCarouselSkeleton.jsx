import React from 'react';
import Slider from 'react-slick';
import ProductCardSkeleton from '../../product/ProductCardSkeleton';
import { carouselSettings } from './carouselSettings';
import classes from './ProductCarousel.module.css';

const ProductCarouselSkeleton = () => {
    // Create skeleton data for 4 products (matching slidesToShow)
    const skeletonProducts = Array.from({ length: 4 }, (_, index) => ({ id: index }));

    return (
        <div className={`${classes.carousel_container} mt-3 mb-5`}>
            <h2 className="mb-3">Latest Products</h2>
            <Slider {...carouselSettings}>
                {skeletonProducts.map((_, index) => (
                    <div key={index} className="">
                        <ProductCardSkeleton />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductCarouselSkeleton;
