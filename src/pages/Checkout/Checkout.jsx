import React from 'react';
import { UI, Checkout } from '../../components';
const { Common: { ProgressBar } } = UI;
const { ShippingInfo, OrderSummary, PaymentMethod } = Checkout;
import { useCheckout } from '../../hooks/useCheckout';

const CheckoutPage = () => {
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

    if (loading) return <div className="mt-4">Loading...</div>;

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                <ProgressBar currentStep={currentStep} totalSteps={3} />
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
        </div>
    );
};

export default CheckoutPage;
