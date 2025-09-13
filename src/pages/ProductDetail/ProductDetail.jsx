import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductImage, ProductInfo, ProductActionsContainer } from '../../components/product/detail';
import Loading from '../../components/ui/common/Loading';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

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

    if (loading) return <Loading />;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <MainFrame>
            <SecondaryFrame>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-4     p-0">
                        <ProductImage image={product.image} name={product.name} />
                    </div>
                    <div className="col-12 col-md-4 p-0">
                        <ProductInfo name={product.name} description={product.description} />
                    </div>
                    <div className="col-12 col-md-6 col-lg-2 p-0">
                        <ProductActionsContainer product={product} />
                    </div>
                </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default ProductDetail;
