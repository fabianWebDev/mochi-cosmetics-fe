import Button from '../ui/common/Button';
import classes from './ContactForm.module.css';
import Input from '../ui/common/Input';

const ContactForm = ({ handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} className={`${classes.contact_form}`}>
            <h1 className="custom_h1 mb-3">Contact</h1>
            <p className="custom_p box_padding">We'd love to hear from you! Please fill out the form below to get in touch with us.</p>
            <Input
                label=""
                type="text"
                id="name"
                name="name"
                required
                placeholder="Name"
            />
            <Input
                label=""
                type="text"
                id="phone"
                name="phone"
                required
                placeholder="Phone"
            />
            <Input
                label=""
                type="email"
                id="email"
                name="email"
                required
                placeholder="Email"
            />
            <textarea
                label=""
                type="textarea"
                id="message"
                name="message"
                rows="3"
                required
                placeholder="Write your message here..."
                className={classes.textarea}
            />
            <div className={`${classes.form_group} box_padding mb-2`}>
                <label className={`${classes.radio_label} m-0`}>Where do you prefer we contact you back?</label>
                <div className={classes.radio_group}>
                    <label className={classes.radio_option}>
                        <input type="radio" name="contactPreference" value="phone" required />
                        Phone
                    </label>
                    <label className={classes.radio_option}>
                        <input type="radio" name="contactPreference" value="email" required />
                        Email
                    </label>
                </div>
            </div>
            <Button type="submit" className={classes.submit_button}>Send Message</Button>
        </form>
    )
}

export default ContactForm;
