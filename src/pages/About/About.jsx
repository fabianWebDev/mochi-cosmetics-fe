import { storeConfig } from '../../config/storeConfig';
import classes from './About.module.css';

const About = () => {
    return (
        <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 smooth-col p-0">
                <div className={classes.about_container}>
                    <h1 className="custom_h1 mb-4">About {storeConfig.name}</h1>
                    
                    {/* Hero Section */}
                    <div className={classes.hero_section}>
                        <p className="custom_p mb-4">
                            Welcome to {storeConfig.name}, your trusted destination for quality products and exceptional shopping experiences. 
                            We're passionate about connecting customers with the products they love while providing outstanding service and support.
                        </p>
                    </div>

                    {/* Our Story Section */}
                    <div className={classes.section}>
                        <h2 className="custom_h2 mb-3">Our Story</h2>
                        <p className="custom_p mb-3">
                            Founded with a vision to create a seamless online shopping experience, {storeConfig.name} began as a small 
                            family business with big dreams. What started as a local store has grown into a comprehensive e-commerce 
                            platform serving customers nationwide.
                        </p>
                        <p className="custom_p">
                            Our journey has been driven by a simple mission: to make quality products accessible to everyone while 
                            maintaining the personal touch that sets us apart from larger retailers.
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="row">
                        <div className="col-12 col-md-6 mb-4">
                            <div className={classes.mission_card}>
                                <h3 className="custom_h3 mb-2">Our Mission</h3>
                                <p className="custom_p">
                                    To provide our customers with exceptional products, outstanding service, and a shopping experience 
                                    that exceeds expectations while building lasting relationships with our community.
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                            <div className={classes.mission_card}>
                                <h3 className="custom_h3 mb-2">Our Vision</h3>
                                <p className="custom_p">
                                    To become the leading e-commerce platform known for quality, reliability, and customer satisfaction, 
                                    while continuously innovating to meet the evolving needs of our customers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className={classes.section}>
                        <h2 className="custom_h2 mb-3">Our Values</h2>
                        <div className="row">
                            <div className="col-12 col-md-4 mb-3">
                                <div className={classes.value_item}>
                                    <h4 className="custom_h3 mb-2">Quality</h4>
                                    <p className="custom_p">
                                        We carefully select every product to ensure it meets our high standards for quality and reliability.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 mb-3">
                                <div className={classes.value_item}>
                                    <h4 className="custom_h3 mb-2">Customer First</h4>
                                    <p className="custom_p">
                                        Our customers are at the heart of everything we do. We're committed to providing exceptional 
                                        service and support.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 mb-3">
                                <div className={classes.value_item}>
                                    <h4 className="custom_h3 mb-2">Integrity</h4>
                                    <p className="custom_p">
                                        We conduct business with honesty, transparency, and ethical practices in all our interactions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className={classes.section}>
                        <h2 className="custom_h2 mb-3">Why Choose {storeConfig.name}?</h2>
                        <div className="row">
                            <div className="col-12 col-md-6 mb-3">
                                <div className={classes.feature_item}>
                                    <h4 className="custom_h3 mb-2">✓ Wide Selection</h4>
                                    <p className="custom_p">
                                        Browse through thousands of carefully curated products across multiple categories.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <div className={classes.feature_item}>
                                    <h4 className="custom_h3 mb-2">✓ Fast Shipping</h4>
                                    <p className="custom_p">
                                        Quick and reliable delivery to get your products to you as soon as possible.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <div className={classes.feature_item}>
                                    <h4 className="custom_h3 mb-2">✓ Secure Shopping</h4>
                                    <p className="custom_p">
                                        Your security is our priority with encrypted transactions and secure payment processing.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <div className={classes.feature_item}>
                                    <h4 className="custom_h3 mb-2">✓ Customer Support</h4>
                                    <p className="custom_p">
                                        Our dedicated team is here to help with any questions or concerns you may have.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className={classes.cta_section}>
                        <h3 className="custom_h3 mb-2">Get in Touch</h3>
                        <p className="custom_p mb-3">
                            Have questions about our products or services? We'd love to hear from you! 
                            Our team is here to help you find exactly what you're looking for.
                        </p>
                        <a href="/contact" className={classes.cta_button}>
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
