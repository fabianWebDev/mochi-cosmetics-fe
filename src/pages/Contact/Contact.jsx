import ContactForm from '../../components/contact/ContactForm';


const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add the logic to handle the form submission
        // For example, sending the data to an API endpoint
        console.log('Form submitted');
    };

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-10 col-md-8 col-lg-8 col-xl-5">
                <ContactForm handleSubmit={handleSubmit} />
            </div>
        </div>
    )
}

export default Contact;
