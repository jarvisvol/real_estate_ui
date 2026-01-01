import React, { useEffect } from 'react';
import '../css/CustomFooter.css';
import feather from 'feather-icons';
import { Link } from 'react-router-dom';

const CustomFooter = () => {
    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="custom-footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className="footer-logo">
                        <i data-feather="home"></i> Balaji Housings
                    </div>
                    <p className="footer-description">
                        Helping you find your dream home since 2010. Our mission is to make real estate transactions simple and stress-free.
                    </p>
                    <div className="social-links">
                        <Link to="#" aria-label="Facebook">
                            <i data-feather="facebook"></i>
                        </Link>
                        <Link to="#" aria-label="Twitter">
                            <i data-feather="twitter"></i>
                        </Link>
                        <Link to="#" aria-label="Instagram">
                            <i data-feather="instagram"></i>
                        </Link>
                        <Link to="#" aria-label="LinkedIn">
                            <i data-feather="linkedin"></i>
                        </Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Quick Links</h3>
                    <div className="footer-links">
                        <Link to="/">Home</Link>
                        <Link to="/properties">Properties</Link>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Services</h3>
                    <div className="footer-links">
                        <Link to="/properties">Buying</Link>
                        <Link to="/properties">Selling</Link>
                        <Link to="/contact">Renting</Link>
                        <Link to="/contact">Property Management</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-heading">Contact</h3>
                    <div className="footer-links contact-links">
                        <Link to="tel:+91-7678165297">
                            <i data-feather="phone" className="mr-2"></i> +91 7678165297
                        </Link>
                        <Link to="mailto:info@balajiproperties.com">
                            <i data-feather="mail" className="mr-2"></i> info@balajiproperties.com
                        </Link>
                        <Link to="#address" className="address-link">
                            <i data-feather="map-pin" className="mr-2"></i> 123 Real Estate Adarsh Nagar, Najibabad
                        </Link>
                    </div>
                </div>
            </div>

            <div className="copyright">
                &copy; {currentYear} Ballaji Housings. All rights reserved.
            </div>
        </footer>
    );
};

export default CustomFooter;