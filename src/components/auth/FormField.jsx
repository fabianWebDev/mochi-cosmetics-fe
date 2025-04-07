import React from 'react';

const FormField = ({ label, id, name, type, required, placeholder, value, onChange }) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default FormField; 