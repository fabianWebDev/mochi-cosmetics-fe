import ContactForm from '../../components/contact/ContactForm';


const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Send the form data to the server
    };

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-10 col-md-8 col-lg-6 col-xl-4 col-xxl-3 smooth-col p-0">
                <ContactForm handleSubmit={handleSubmit} />
            </div>
        </div>
    )
}

export default Contact;
