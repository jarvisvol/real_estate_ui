import React, { useEffect } from 'react';
import '../css/CustomFooter.css';
import feather from 'feather-icons';

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
                        <i data-feather="home"></i> HomeHaven
                    </div>
                    <p className="footer-description">
                        Helping you find your dream home since 2010. Our mission is to make real estate transactions simple and stress-free.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook">
                            <i data-feather="facebook"></i>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <i data-feather="twitter"></i>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <i data-feather="instagram"></i>
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            <i data-feather="linkedin"></i>
                        </a>
                    </div>
                </div>
                
                <div className="footer-section">
                    <h3 className="footer-heading">Quick Links</h3>
                    <div className="footer-links">
                        <a href="/">Home</a>
                        <a href="#properties">Properties</a>
                        <a href="#agents">Agents</a>
                        <a href="#about">About Us</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
                
                <div className="footer-section">
                    <h3 className="footer-heading">Services</h3>
                    <div className="footer-links">
                        <a href="#buying">Buying</a>
                        <a href="#selling">Selling</a>
                        <a href="#renting">Renting</a>
                        <a href="#property-management">Property Management</a>
                        <a href="#valuation">Valuation</a>
                    </div>
                </div>
                
                <div className="footer-section">
                    <h3 className="footer-heading">Contact</h3>
                    <div className="footer-links contact-links">
                        <a href="tel:+15551234567">
                            <i data-feather="phone" className="mr-2"></i> +1 (555) 123-4567
                        </a>
                        <a href="mailto:info@homehaven.com">
                            <i data-feather="mail" className="mr-2"></i> info@homehaven.com
                        </a>
                        <a href="#address" className="address-link">
                            <i data-feather="map-pin" className="mr-2"></i> 123 Real Estate Ave, NY
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="copyright">
                &copy; {currentYear} HomeHaven. All rights reserved.
            </div>
        </footer>
    );
};

export default CustomFooter;