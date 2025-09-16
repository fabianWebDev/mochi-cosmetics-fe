import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import classes from './CaregoryCard.module.css';

const CategoryCardSkeleton = () => {
  return (
    <div className={`${classes.card_container_skeleton} card`}>
      {/* Image skeleton - matches CategoryCard image */}
      <Skeleton 
        height="100%" 
        width="100%" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: '8px'
        }} 
      />
      
      {/* Overlay container skeleton - matches CategoryCard overlay */}
      <div>
        {/* Title skeleton */}
        <Skeleton 
          height={24} 
          width="80%" 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px'
          }} 
        />
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;
