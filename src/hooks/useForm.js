/**
 * Form Management Hook
 * 
 * This hook provides a React-friendly interface for managing form state and validation.
 * It simplifies form handling by providing a centralized state management system
 * with built-in error handling and change event management.
 * 
 * Key Features:
 * - Centralized form state management
 * - Automatic form field updates
 * - Error state management
 * - Simple and reusable form handling
 * - Support for any form structure
 * 
 * @module useForm
 * @requires react - React hooks for state management
 * 
 * @example
 * import useForm from '../hooks/useForm';
 * 
 * function LoginForm() {
 *   const { formData, error, setError, handleChange } = useForm({
 *     email: '',
 *     password: ''
 *   });
 * 
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     // Handle form submission
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         name="email"
 *         value={formData.email}
 *         onChange={handleChange}
 *         placeholder="Email"
 *       />
 *       <input
 *         name="password"
 *         type="password"
 *         value={formData.password}
 *         onChange={handleChange}
 *         placeholder="Password"
 *       />
 *       {error && <div className="error">{error}</div>}
 *       <button type="submit">Login</button>
 *     </form>
 *   );
 * }
 */

import { useState } from 'react';

/**
 * Custom hook for managing form state and validation
 * 
 * This hook provides a simple and reusable interface for form management,
 * including state updates, error handling, and change event management.
 * It's designed to work with any form structure and provides a consistent
 * API for form handling across the application.
 * 
 * @param {Object} initialState - Initial form data object
 * @returns {Object} Form state and methods
 * @returns {Object} returns.formData - Current form data object
 * @returns {Function} returns.setFormData - Function to update form data directly
 * @returns {string} returns.error - Current error message
 * @returns {Function} returns.setError - Function to set error message
 * @returns {Function} returns.handleChange - Function to handle form input changes
 * 
 * @example
 * const { formData, error, setError, handleChange } = useForm({
 *   username: '',
 *   email: '',
 *   password: ''
 * });
 * 
 * // Handle form input changes
 * const handleInputChange = (e) => {
 *   handleChange(e);
 * };
 * 
 * // Set error message
 * const handleValidationError = (message) => {
 *   setError(message);
 * };
 * 
 * // Update form data directly
 * const resetForm = () => {
 *   setFormData({
 *     username: '',
 *     email: '',
 *     password: ''
 *   });
 * };
 */
const useForm = (initialState) => {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');

    /**
     * Handles form input changes and updates the form state
     * 
     * This function extracts the name and value from the input event
     * and updates the corresponding field in the form data state.
     * It supports any input type that has a name and value property.
     * 
     * @param {Event} e - The input change event
     * @returns {void}
     * 
     * @example
     * const { handleChange } = useForm({ name: '', email: '' });
     * 
     * // Handle text input
     * // <input
     * //   name="name"
     * //   value={formData.name}
     * //   onChange={handleChange}
     * // />
     * 
     * // Handle select input
     * // <select name="category" value={formData.category} onChange={handleChange}>
     * //   <option value="">Select category</option>
     * //   <option value="electronics">Electronics</option>
     * // </select>
     */
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