import styles from './OrderItems.module.css';

const OrderItems = ({ items }) => (
    <div className={styles.order_items}>
        <h3 className={styles.section_title}>Order Items</h3>
        <div className="table-responsive">
            <table className={styles.items_table}>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item?.id || Math.random()}>
                            <td>{item?.product_name || 'N/A'}</td>
                            <td>{item?.quantity || 0}</td>
                            <td>${Number(item?.price_at_time || 0).toFixed(2)}</td>
                            <td>${((item?.quantity || 0) * Number(item?.price_at_time || 0)).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default OrderItems; 