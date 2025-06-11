import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductImage, ProductInfo, ProductActionsContainer } from '../../components/product/detail';

const ProductDetail = () => {
    const { identifier } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {   
                const data = await productService.getProduct(identifier);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [identifier]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="row mt-3 justify-content-center">
            <div className="col-12 col-md-4 col-lg-3">
                <ProductImage image={product.image} name={product.name} />
            </div>
            <div className="col-12 col-md-4 col-lg-3">
                <ProductInfo name={product.name} description={product.description} />
            </div>
            <div className="col-12 col-md-6 col-lg-2">
                <ProductActionsContainer product={product} />
            </div>
        </div>
    );
};

export default ProductDetail;
