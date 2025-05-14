import styles from './ShippingInfo.module.css';

const ShippingInfo = ({ shippingAddress, isPickup }) => {
    if (isPickup) {
        return <p><strong>Pick up in store</strong></p>;
    }

    const shippingLines = shippingAddress.split('\n');
    const fullName = shippingLines[0];
    const address = shippingLines[1];
    const cityPostal = shippingLines[2]?.split(',');
    const city = cityPostal ? cityPostal[0].trim() : '';
    const postalCode = cityPostal && cityPostal[1] ? cityPostal[1].trim() : '';
    const phone = shippingLines[3]?.replace('Phone:', '').trim() || '';

    return (
        <div className={styles.shipping_info}>
            <h3 className={styles.section_title}>Shipping Information</h3>
            <p><strong>Name:</strong> {fullName}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>City:</strong> {city}</p>
            <p><strong>Postal Code:</strong> {postalCode}</p>
            <p><strong>Phone:</strong> {phone}</p>
        </div>
    );
};

export default ShippingInfo; 