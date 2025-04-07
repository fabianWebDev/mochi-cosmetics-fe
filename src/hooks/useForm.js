import { useState } from 'react';

const useForm = (initialState) => {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return {
        formData,
        setFormData,
        error,
        setError,
        handleChange
    };
};

export default useForm; 