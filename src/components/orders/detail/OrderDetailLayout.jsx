import OrderHeader from '../confirmation/OrderHeader';
import ShippingInfo from '../confirmation/ShippingInfo';
import OrderDetails from '../confirmation/OrderDetails';
import OrderItems from '../confirmation/OrderItems';
import OrderDetailActionButtons from './OrderDetailActionButtons';
import classes from './OrderDetailLayout.module.css';

const OrderDetailLayout = ({ order, onCancelClick, canCancelOrder }) => {
    return (

        <div className={classes.order_detail_content}>
            <OrderHeader orderId={order.order_id} isConfirmation={false} />
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
            <OrderDetailActionButtons
                onCancelClick={onCancelClick}
                canCancelOrder={canCancelOrder}
            />
        </div>
    );
};

export default OrderDetailLayout;
