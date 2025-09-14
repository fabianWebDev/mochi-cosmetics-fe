import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';
import classes from './ProductList.module.css';

const ProductListSkeleton = ({ count = 6 }) => {
    // Create skeleton data for the specified number of products
    const skeletonProducts = Array.from({ length: count }, (_, index) => ({ id: index }));

    return (
        <div className={classes.product_list_container}>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3">
                {skeletonProducts.map((_, index) => (
                    <div key={index} className="col p-0">
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListSkeleton;
