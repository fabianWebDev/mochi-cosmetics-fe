import React from 'react';
import CategoryCardSkeleton from '../../categories/CategoryCardSkeleton';
import classes from './CategoriesGrid.module.css';

const CategoriesGridSkeleton = ({ count = 6 }) => {
  const skeletonCategories = Array.from({ length: count }, (_, index) => ({ id: index }));

  return (
    <div className={classes.categories_grid}>
      {skeletonCategories.map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CategoriesGridSkeleton;
