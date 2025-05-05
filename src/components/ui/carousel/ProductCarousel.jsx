import React, { useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useLatestProducts } from '../../../hooks/useLatestProducts';
import ProductSlider from './ProductSlider';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../../../services/cartService';
import { useNavigate } from 'react-router-dom';

const ProductCarousel = () => {
    const { products, loading, error } = useLatestProducts();
    const [addingToCart, setAddingToCart] = useState({});
    const navigate = useNavigate();

    const handleViewDetails = (productId) => navigate(`/product/${productId}`);

    const handleAddToCart = async (product) => {
        if (addingToCart[product.id]) return;

        setAddingToCart(prev => ({ ...prev, [product.id]: true }));
        toast.dismiss();
        try {
            await cartService.addToCart(product.id, 1);
            toast.success(
                <div>
                    {product.name} added to cart!
                    <Link to="/cart" style={{ marginLeft: "5px", color: "#007bff" }}>
                        Go to cart
                    </Link>
                </div>
            );
            // Wait 1.5 seconds before allowing another addition
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            const message = error.response?.data?.error === "Not enough stock available"
                ? "Sorry, this product is out of stock"
                : "Error adding product to cart";
            toast.dismiss();
            toast.error(message);
        } finally {
            setAddingToCart(prev => ({ ...prev, [product.id]: false }));
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading products</div>;
    }

    return (
        <div className="mt-3">
            <h2 className="text-center custom_h1 mb-3">Latest Products</h2>
            <ProductSlider
                products={products}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
                addingToCart={addingToCart}
            />
        </div>
    );
};

export default ProductCarousel; 