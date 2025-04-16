import { toast } from 'react-toastify';

export const handleCheckoutError = (error, navigate) => {
    console.error('Checkout error:', error);

    if (error.response) {
        const errorData = error.response.data;
        console.error('Error response data:', errorData);

        toast.dismiss();
        switch (error.response.status) {
            case 400:
                if (typeof errorData === 'object') {
                    Object.entries(errorData).forEach(([field, messages]) => {
                        toast.error(`${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
                    });
                } else {
                    toast.error(errorData);
                }
                break;
            case 401:
                toast.error('Session expired. Please login again.');
                navigate('/login');
                break;
            case 403:
                toast.error('You do not have permission to perform this action.');
                break;
            case 404:
                toast.error('Order not found.');
                break;
            case 500:
                toast.error('Server error. Please try again later.');
                break;
            default:
                toast.error('Error processing your request.');
        }
    } else if (error.request) {
        toast.error('Could not connect to the server.');
    } else {
        toast.error('Error processing your request.');
    }
}; 