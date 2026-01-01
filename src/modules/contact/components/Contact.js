import React, { useEffect, useState } from 'react';
import feather from 'feather-icons';
import { useDispatch, useSelector } from 'react-redux';
import { submitClientContact } from '../../Properties/store/actions';
import '../css/ContactPage.css';

const ContactPage = () => {
    const dispatch = useDispatch();
    const {status} = useSelector(state => state.property);
    
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
        purpose: 'general' // general, list_property, inquiry
    });
    
    const [formErrors, setFormErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('general'); // general, list-property, inquiry

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, []);

    useEffect(()=>{
      switch(status){
        case 'CLIENT_CONTACT_SUCCESS':
          setSubmitLoading(false);
          setSubmitSuccess(true);
          break;
        case 'CLIENT_CONTACT_FAILURE':
          setSubmitLoading(false);
          setSubmitSuccess(false);
          break;
        default:
          break;
      }
    },[status])

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setContactForm(prev => ({
            ...prev,
            purpose: tab === 'list-property' ? 'list_property' : 
                    tab === 'inquiry' ? 'inquiry' : 'general'
        }));
    };

    const validateContactForm = () => {
        const errors = {};
        
        if (!contactForm.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!contactForm.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!contactForm.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(contactForm.phoneNumber)) {
            errors.phoneNumber = 'Please enter a valid 10-digit Indian phone number';
        }
        
        if (!contactForm.message.trim()) {
            errors.message = 'Message is required';
        } else if (contactForm.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters';
        }
        
        return errors;
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateContactForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        setFormErrors({});
        setSubmitLoading(true);
        
        // Add purpose to message for better context
        const messageWithPurpose = `[${contactForm.purpose.toUpperCase()} INQUIRY]\n${contactForm.message}`;
        
        const contactData = {
            ...contactForm,
            message: messageWithPurpose
        };
        dispatch(submitClientContact(contactData));
    };

    const contactInfo = [
        {
            icon: 'phone',
            title: 'Phone Number',
            value: '+91 98765 43210',
            link: 'tel:+919876543210'
        },
        {
            icon: 'mail',
            title: 'Email Address',
            value: 'contact@propertyfinder.com',
            link: 'mailto:contact@propertyfinder.com'
        },
        {
            icon: 'map-pin',
            title: 'Office Address',
            value: '123 Property Avenue, Bandra West, Mumbai, Maharashtra 400050',
            link: 'https://maps.google.com/?q=123+Property+Avenue+Bandra+West+Mumbai'
        }
    ];

    const propertyTypes = [
        'Residential Apartments',
        'Independent Houses',
        'Villas & Bungalows',
        'Plots & Land',
        'Commercial Properties',
        'Agricultural Land',
        'Industrial Properties',
        'Rental Properties'
    ];

    return (
        <div className="contact-page">
            <main className="contact-container">
                {/* Hero Section */}
                <section className="contact-hero">
                    <div className="hero-overlay-contact"></div>
                    <div className="hero-content-contact">
                        <h1 className="hero-title-contact">Contact Us</h1>
                        <p className="hero-subtitle-contact">
                            Get in touch with our expert team for all your property needs
                        </p>
                    </div>
                </section>

                {/* Call to Action - List Your Property */}
                <section className="list-property-cta">
                    <div className="cta-content">
                        <div className="cta-text">
                            <h2 className="cta-title">Want to List Your Property?</h2>
                            <p className="cta-description">
                                Get your property sold or rented faster with our expert services. 
                                Fill out the form below or give us a call to get started.
                            </p>
                            <div className="cta-stats">
                                <div className="cta-stat">
                                    <div className="stat-number">15+</div>
                                    <div className="stat-label">Days Average Selling Time</div>
                                </div>
                                <div className="cta-stat">
                                    <div className="stat-number">95%</div>
                                    <div className="stat-label">Client Satisfaction Rate</div>
                                </div>
                                <div className="cta-stat">
                                    <div className="stat-number">₹500Cr+</div>
                                    <div className="stat-label">Properties Sold</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="contact-main-content">
                    {/* Left Side - Contact Form */}
                    <div className="contact-form-section">
                        <div className="form-header">
                            <h2 className="form-title">Send Us a Message</h2>
                            <p className="form-subtitle">
                                Please fill out the form below and our team will get back to you within 24 hours.
                            </p>
                        </div>

                        {/* Purpose Tabs */}
                        <div className="purpose-tabs">
                            <button 
                                className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
                                onClick={() => handleTabChange('general')}
                            >
                                <i data-feather="message-circle" className="tab-icon"></i>
                                General Inquiry
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'list-property' ? 'active' : ''}`}
                                onClick={() => handleTabChange('list-property')}
                            >
                                <i data-feather="home" className="tab-icon"></i>
                                List Property
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'inquiry' ? 'active' : ''}`}
                                onClick={() => handleTabChange('inquiry')}
                            >
                                <i data-feather="search" className="tab-icon"></i>
                                Property Inquiry
                            </button>
                        </div>

                        {/* Success Message */}
                        {submitSuccess && (
                            <div className="success-message">
                                <i data-feather="check-circle" className="success-icon"></i>
                                <div className="success-content">
                                    <h3 className="success-title">Message Sent Successfully!</h3>
                                    <p className="success-text">
                                        Thank you for contacting us. 
                                        {activeTab === 'list-property' ? ' Our property listing specialist will contact you within 2 hours.' : 
                                         ' Our team will get back to you within 24 hours.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact Form */}
                        <form id="contact-form" onSubmit={handleContactSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                                        placeholder="Enter your full name"
                                        disabled={submitLoading}
                                    />
                                    {formErrors.name && (
                                        <p className="error-message">{formErrors.name}</p>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                                        placeholder="your@email.com"
                                        disabled={submitLoading}
                                    />
                                    {formErrors.email && (
                                        <p className="error-message">{formErrors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={contactForm.phoneNumber}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.phoneNumber ? 'input-error' : ''}`}
                                        placeholder="9876543210"
                                        maxLength="10"
                                        disabled={submitLoading}
                                    />
                                    {formErrors.phoneNumber && (
                                        <p className="error-message">{formErrors.phoneNumber}</p>
                                    )}
                                </div>
                                
                                {activeTab === 'list-property' && (
                                    <div className="form-group">
                                        <label className="form-label">Property Type</label>
                                        <select 
                                            className="form-input"
                                            disabled={submitLoading}
                                        >
                                            <option value="">Select Property Type</option>
                                            {propertyTypes.map((type, index) => (
                                                <option key={index} value={type.toLowerCase().replace(/\s+/g, '-')}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    {activeTab === 'general' ? 'Your Message *' :
                                     activeTab === 'list-property' ? 'Property Details *' :
                                     'Property Inquiry Details *'}
                                </label>
                                <textarea
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleContactChange}
                                    rows="5"
                                    className={`form-input ${formErrors.message ? 'input-error' : ''}`}
                                    placeholder={
                                        activeTab === 'general' ? 'Tell us how we can help you...' :
                                        activeTab === 'list-property' ? 'Please provide property details (location, size, price expectations, etc.)...' :
                                        'Please provide details about the property you\'re interested in...'
                                    }
                                    disabled={submitLoading}
                                ></textarea>
                                {formErrors.message && (
                                    <p className="error-message">{formErrors.message}</p>
                                )}
                            </div>

                            {formErrors.submit && (
                                <div className="form-error">
                                    <i data-feather="alert-circle" className="error-icon"></i>
                                    <span>{formErrors.submit}</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={submitLoading}
                            >
                                {submitLoading ? (
                                    <>
                                        <i data-feather="loader" className="animate-spin button-icon"></i>
                                        {activeTab === 'list-property' ? 'Submitting Property Details...' : 'Sending Message...'}
                                    </>
                                ) : (
                                    <>
                                        <i data-feather="send" className="button-icon"></i>
                                        {activeTab === 'list-property' ? 'Submit Property Details' : 'Send Message'}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Contact Information */}
                    <div className="contact-info-section">
                        {/* Contact Information */}
                        <div className="contact-info-card">
                            <h3 className="info-title">Get in Touch</h3>
                            <div className="info-items">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="info-item">
                                        <div className="info-icon">
                                            <i data-feather={item.icon}></i>
                                        </div>
                                        <div className="info-content">
                                            <h4 className="info-item-title">{item.title}</h4>
                                            {item.link ? (
                                                <a 
                                                    href={item.link} 
                                                    className="info-value link"
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="info-value">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <section className="faq-section">
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3 className="faq-question">
                                <i data-feather="help-circle" className="faq-icon"></i>
                                How long does it take to list my property?
                            </h3>
                            <p className="faq-answer">
                                Once you submit your property details, our team will contact you within 2 hours. 
                                The property will be listed on our platform within 24 hours after verification.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">
                                <i data-feather="help-circle" className="faq-icon"></i>
                                What documents do I need to list my property?
                            </h3>
                            <p className="faq-answer">
                                You'll need property ownership documents, ID proof, property tax receipts, 
                                and NOC from society (if applicable). Our team will guide you through the process.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">
                                <i data-feather="help-circle" className="faq-icon"></i>
                                Is there any fee for listing my property?
                            </h3>
                            <p className="faq-answer">
                                No, listing your property is completely free. We only charge a commission 
                                upon successful sale/rental of the property.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">
                                <i data-feather="help-circle" className="faq-icon"></i>
                                How do I schedule a property viewing?
                            </h3>
                            <p className="faq-answer">
                                You can schedule a viewing through our website, mobile app, or by calling 
                                our customer support. We'll coordinate with the property owner for a convenient time.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ContactPage;