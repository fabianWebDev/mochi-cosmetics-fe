import React, { useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useLatestProducts } from '../../../hooks/useLatestProducts';
import ProductSlider from './ProductSlider';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../../../services/cartService';

const ProductCarousel = () => {
    const { products, loading, error } = useLatestProducts();
    const [addingToCart, setAddingToCart] = useState({});

    const handleViewDetails = (productId) => {
        // TODO: Implementar la lógica para ver detalles del producto
        console.log('Viewing product:', productId);
    };

    const handleAddToCart = async (product) => {
        if (addingToCart[product.id]) return;

        setAddingToCart(prev => ({ ...prev, [product.id]: true }));
        toast.dismiss();
        try {
            await cartService.addToCart(product.id, 1);
            toast.success(
                <div>
                    Producto agregado al carrito!
                    <Link to="/cart" style={{ marginLeft: "5px", color: "#007bff" }}>
                        Ir al carrito
                    </Link>
                </div>
            );
            // Wait 1.5 seconds before allowing another addition
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            const message = error.response?.data?.error === "Not enough stock available"
                ? "Lo sentimos, este producto está agotado"
                : "Error al agregar el producto al carrito";
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
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Latest Products</h2>
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