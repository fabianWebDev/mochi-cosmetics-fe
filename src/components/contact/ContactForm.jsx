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
                <input type="text" className={classes.input_field} id="phone" name="phone" required placeholder="Phone" />
            </div>
            <div className={classes.form_group}>
                <input type="email" className={classes.input_field} id="email" name="email" required placeholder="Email" />
            </div>
            <div className={`${classes.form_group} ${classes.mb_none}`}>
                <textarea
                    className={classes.input_field}
                    id="message"
                    name="message"
                    rows="5"
                    required
                    placeholder="Write your message here..."
                ></textarea>
            </div>
            <div className={classes.form_group}>
                <label className={classes.radio_label}>Where do you prefer we contact you back?</label>
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
