import Button from '../ui/common/Button';
import classes from './ContactForm.module.css';
import Input from '../ui/common/Input';
import * as Yup from 'yup';
import { useState } from 'react';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9+\-\s()]*$/, 'Please enter a valid phone number')
        .length(8, 'Phone number must be 8 digits'),
    email: Yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    message: Yup.string()
        .required('Message is required')
        .min(10, 'Message must be at least 10 characters')
        .max(500, 'Message must not exceed 500 characters'),
    contactPreference: Yup.string()
        .required('Please select a contact preference')
        .oneOf(['phone', 'email'], 'Please select either phone or email')
});

const ContactForm = ({ handleSubmit }) => {
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = {
            name: e.target.name.value,
            phone: e.target.phone.value,
            email: e.target.email.value,
            message: e.target.message.value,
            contactPreference: e.target.contactPreference.value
        };

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            await handleSubmit(formData);
            e.target.reset();
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className={`${classes.contact_form}`}>
            <h1 className="custom_h1 mb-3">Contact</h1>
            <p className="custom_p box_padding">We'd love to hear from you! Please fill out the form below to get in touch with us.</p>

            <div className={classes.form_field}>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    error={errors.name}
                />
            </div>

            <div className={classes.form_field}>
                <Input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                    error={errors.phone}
                />

            </div>

            <div className={classes.form_field}>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    error={errors.email}
                />
            </div>
            <div className={classes.form_field}>
                <textarea
                    id="message"
                    name="message"
                    rows="3"
                    placeholder="Write your message here..."
                    className={classes.textarea}
                />
                {errors.message && <div className={classes.error_message}>{errors.message}</div>}
            </div>

            <div className={`${classes.form_group} mb-2`}>
                <label className={`${classes.radio_label} m-0`}>Where do you prefer we contact you back?</label>
                <div className={classes.radio_group}>
                    <label className={classes.radio_option}>
                        <input type="radio" name="contactPreference" value="phone" />
                        Phone
                    </label>
                    <label className={classes.radio_option}>
                        <input type="radio" name="contactPreference" value="email" />
                        Email
                    </label>
                </div>
                {errors.contactPreference && <div className={classes.error_message}>{errors.contactPreference}</div>}
            </div>
            <Button type="submit" className={classes.submit_button} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
};

export default ContactForm;
