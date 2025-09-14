import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ProductListSkeleton } from '../../components/product';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

const ProductsSkeleton = () => {
    return (
        <MainFrame>
            <SecondaryFrame>
                <div className="row">
                    {/* SideBar Skeleton */}
                    <div className="col-md-3 p-0">
                        <div style={{
                            padding: '16px',
                            backgroundColor: 'var(--white-background-color)',
                            border: '1px solid var(--tertiary-color)',
                            borderRadius: 'var(--border-radius-medium)',
                            marginBottom: '8px'
                        }}>
                            {/* Sort By section */}
                            <div style={{ marginBottom: '16px' }}>
                                <Skeleton height={16} width="60px" style={{ marginBottom: '8px' }} />
                                <Skeleton height={40} width="100%" />
                            </div>
                            
                            {/* Checkbox section */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Skeleton height={20} width={20} style={{ marginRight: '8px' }} />
                                    <Skeleton height={16} width="80px" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Content Skeleton */}
                    <div className="col-md-9 p-0">
                        <div className="d-flex flex-column h-100">
                            {/* Product List Skeleton */}
                            <ProductListSkeleton count={6} />
                            
                            {/* Pagination Skeleton */}
                            <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Skeleton height={40} width={300} />
                            </div>
                        </div>
                    </div>
                </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default ProductsSkeleton;
