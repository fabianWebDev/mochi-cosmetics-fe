import OrderHeader from './OrderHeader';
import ShippingInfo from './ShippingInfo';
import OrderDetails from './OrderDetails';
import OrderItems from './OrderItems';
import OrderActionButtons from './OrderActionButtons';
import classes from './OrderConfimationLayout.module.css';

const OrderConfimationLayout = ({ order }) => {
    return (
        <div className={classes.order_confirmation}>
            <OrderHeader orderId={order.order_id} isConfirmation={true} />
            <div className="row">
                <div className="col-12 col-md-8 p-0">
                    <ShippingInfo
                        shippingAddress={order.shipping_address}
                        isPickup={order.pickup}
                    />
                </div>
                <div className="col-12 col-md-4 p-0">
                    <OrderDetails order={order} />
                </div>
            </div>
            {order.items && order.items.length > 0 && (
                <OrderItems items={order.items} />
            )}
            <OrderActionButtons />
        </div>
    );
};

export default OrderConfimationLayout;
