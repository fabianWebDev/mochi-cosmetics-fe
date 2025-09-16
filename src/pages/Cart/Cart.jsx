import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Cart } from '../../components';
const { CartItem, CartSummary } = Cart;
import Loading from '../../components/ui/common/Loading';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';
import TertiaryFrame from '../../components/ui/layout/TertiaryFrame';
const CartPage = () => {
    const {
        cart,
        loading,
        updateQuantity,
        removeItem,
        calculateTotal,
        handleCheckout,
        isAuthenticated
    } = useCart();

    if (loading) return <Loading />;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <MainFrame>
                <SecondaryFrame>
                    <div className="col-12 col-md-8 col-lg-8 col-xl-8 margin_auto">
                        <h1 className="mb-3 custom_h1">Shopping Cart</h1>
                        <div className="alert alert-info">
                            Your cart is empty. <Link to="/products" className="alert-link">Continue shopping</Link>
                        </div>
                    </div>
                </SecondaryFrame>
            </MainFrame>
        );
    }

    return (
        <MainFrame>
            <SecondaryFrame>
                <div className="col-12 col-md-10 col-lg-8 col-xl-8 margin_auto">
                    <TertiaryFrame>
                    <h1 className="mb-3 custom_h1">Shopping Cart</h1>
                    {!isAuthenticated && (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            Please <Link to="/login" className="alert-link">log in</Link> to save your cart and proceed with checkout.
                        </div>
                    )}
                    {cart.items.map(item => (
                        <CartItem
                            key={item.product.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                        />
                    ))}
                    <hr />
                    <CartSummary
                        total={calculateTotal()}
                        onCheckout={handleCheckout}
                            isAuthenticated={isAuthenticated}
                        />
                    </TertiaryFrame>
                </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default CartPage;