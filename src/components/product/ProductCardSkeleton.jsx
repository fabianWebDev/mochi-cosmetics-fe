import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductCardSkeleton = () => {
  return (
    <div style={{
      width: '100%',
      border: '1px solid var(--tertiary-color)',
      borderRadius: 'var(--border-radius-medium)',
    }}>
      {/* Image container - matches ProductCard image container */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 'var(--border-radius-medium)',
        borderTopRightRadius: 'var(--border-radius-medium)',
        height: '250px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px #dee2e6' // Temporary border to see the container
      }}>
        <Skeleton height={200} width={200} />
      </div>
      
      {/* Details container - matches ProductCard details */}
      <div style={{
        backgroundColor: 'var(--white-background-color)',
        padding: '16px',
        borderBottomRightRadius: 'var(--border-radius-medium)',
        borderBottomLeftRadius: 'var(--border-radius-medium)',
        borderTop: '2px solid var(--tertiary-color)',
      }}>
        {/* Product name skeleton */}
        <Skeleton height={20} width="80%" style={{ marginBottom: '8px' }} />
        
        {/* Description skeleton */}
        <Skeleton height={16} width="100%" style={{ marginBottom: '12px' }} />
        
        {/* Price and stock container */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <Skeleton height={18} width={60} />
          <Skeleton height={20} width={80} style={{
            backgroundColor: 'var(--tertiary-color)',
            borderRadius: 'var(--border-radius-medium)',
            padding: '2px 8px'
          }} />
        </div>
        
        {/* Button container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '8px'
        }}>
          <Skeleton height={36} width="100%" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
