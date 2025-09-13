import React from 'react';
import { UI, Checkout } from '../../components';
const { Common: { ProgressBar } } = UI;
const { ShippingInfo, OrderSummary, PaymentMethod, CheckoutSidebar } = Checkout;
import { useCheckout } from '../../hooks/useCheckout';
import Loading from '../../components/ui/common/Loading';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

const CheckoutPage = () => {
    const {
        cart,
        loading,
        currentStep,
        shippingInfo,
        shippingMethods,
        handleInputChange,
        handleNextStep,
        handleSubmit,
        setCurrentStep,
        calculateTotal,
        calculateSubtotal,
        calculateShippingCost
    } = useCheckout();

    if (loading) return <Loading />;

    return (
        <MainFrame>
            <SecondaryFrame>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 box_padding">
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
                    <div className="col-12 col-md-4 col-lg-3 box_padding">
                        <CheckoutSidebar
                            cart={cart}
                            calculateTotal={calculateTotal}
                            calculateSubtotal={calculateSubtotal}
                            calculateShippingCost={calculateShippingCost}
                            shippingInfo={shippingInfo}
                            shippingMethods={shippingMethods}
                        />
                    </div>
                </div>
            </SecondaryFrame>
        </MainFrame>
    );
};

export default CheckoutPage;
