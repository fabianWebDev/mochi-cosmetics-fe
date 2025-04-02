import React from 'react';
import ProgressBar from '../components/ui/ProgressBar';
import ShippingInfo from '../components/checkout/ShippingInfo';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentMethod from '../components/checkout/PaymentMethod';
import { useCheckout } from '../hooks/useCheckout';

const Checkout = () => {
    const {
        cart,
        loading,
        currentStep,
        shippingInfo,
        handleInputChange,
        handleNextStep,
        handleSubmit,
        setCurrentStep
    } = useCheckout();

    if (loading) return <div className="container mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <ProgressBar currentStep={currentStep} totalSteps={3} />
            <h1 className="mb-4">Checkout</h1>
            {currentStep === 1 && (
                <ShippingInfo
                    shippingInfo={shippingInfo}
                    onInputChange={handleInputChange}
                    onSubmit={handleNextStep}
                />
            )}
            {currentStep === 2 && (
                <OrderSummary
                    cart={cart}
                    onBack={() => setCurrentStep(1)}
                    onNext={handleNextStep}
                />
            )}
            {currentStep === 3 && (
                <PaymentMethod
                    onBack={() => setCurrentStep(2)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default Checkout;
