import Button from '../ui/common/Button';
import classes from './ContactForm.module.css';

const ContactForm = ({ handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} className={`${classes.contact_form} col-md-8`}>
            <h1 className="custom_h1 mb-3">Contact</h1>
            <div className={classes.form_group}>
                <input type="text" className={classes.input_field} id="name" name="name" required placeholder="Name" />
            </div>
            <div className={classes.form_group}>
                <input type="email" className={classes.input_field} id="email" name="email" required placeholder="Email" />
            </div>
            <div className={classes.form_group}>
                <textarea
                className={classes.input_field}
                id="message"
                name="message"
                rows="5"
                required
                    placeholder="Write your message here..."
                ></textarea>
            </div>
            <Button type="submit" className={classes.submit_button}>Send Message</Button>
        </form>
    )
}

export default ContactForm;
