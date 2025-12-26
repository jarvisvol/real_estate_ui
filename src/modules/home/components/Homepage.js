import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropertyCard from '../../common/components/PropertyCard';
import feather from 'feather-icons';
import { fetchUserProperties, submitClientContact } from '../../Properties/store/actions';
import '../css/HomePage.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get properties from Redux store
    const { 
        properties, 
        loading, 
        totalProperties, 
        status, 
        error, 
    } = useSelector(state => state.property);

    const [searchFilters, setSearchFilters] = useState({
        city: '',
        propertyType: '',
        priceRange: ''
    });

    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [contactSubmitSuccess, setContactSubmitSuccess] = useState(false);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Fetch featured properties on load (first 3 properties)
        dispatch(fetchUserProperties({ page: 1, limit: 3 }));
    }, [dispatch]);

    useEffect(() => {
        // Handle contact form submission status
        if (status === 'CLIENT_CONTACT_SUCCESS') {
            setContactSubmitSuccess(true);
            // Reset form on success
            setContactForm({
                name: '',
                email: '',
                phoneNumber: '',
                message: ''
            });
            setFormErrors({});
            
            // Auto-hide success message after 5 seconds
            const timer = setTimeout(() => {
                setContactSubmitSuccess(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
        
        // Handle contact form error
        if (status === 'CLIENT_CONTACT_FAILURE' && error) {
            setFormErrors(prev => ({
                ...prev,
                submit: error.message || 'Failed to send message. Please try again.'
            }));
        }
    }, [status, error]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // Navigate to properties page with search filters
        const queryParams = new URLSearchParams();

        if (searchFilters.city) queryParams.append('city', searchFilters.city);
        if (searchFilters.propertyType) queryParams.append('propertyType', searchFilters.propertyType);
        if (searchFilters.priceRange) {
            const [min, max] = searchFilters.priceRange.split('-').map(p => p.trim().replace(/[₹$,]/g, ''));
            if (min) queryParams.append('minPrice', min);
            if (max) queryParams.append('maxPrice', max);
        }

        navigate(`/properties?${queryParams.toString()}`);
    }

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
        
        // Clear submit error if it exists
        if (formErrors.submit) {
            setFormErrors(prev => ({
                ...prev,
                submit: ''
            }));
        }
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
        setContactSubmitSuccess(false);
        
        // Dispatch the contact action
        dispatch(submitClientContact(contactForm));
    };

    // Format price for display
    const formatPrice = (amount) => {
        if (!amount) return '₹0';

        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)}Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        } else {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }
    };

    // Get featured properties from Redux (first 3)
    const featuredProperties = properties?.slice(0, 3)?.map(property => ({
        id: property._id,
        image: property.images?.[0]?.url || 'http://static.photos/estate/640x360',
        price: formatPrice(property.price?.amount),
        address: `${property.propertyAddress?.streetAddress || ''}, ${property.propertyAddress?.city || ''}`,
        beds: property.features?.bedrooms || 'N/A',
        baths: property.features?.bathrooms || 'N/A',
        sqft: property.dimensions?.plotArea?.value || property.dimensions?.builtUpArea?.value || 'N/A',
        type: 'Property',
        status: property.price?.priceType === 'sale' ? 'For Sale' : 'For Rent'
    })) || [];

    const testimonials = [
        {
            id: 1,
            name: 'Rahul Sharma',
            image: 'http://static.photos/people/100x100/1',
            rating: 5,
            text: '"Found my dream apartment in Mumbai through PropertyFinder. The entire process was smooth and transparent!"'
        },
        {
            id: 2,
            name: 'Priya Patel',
            image: 'http://static.photos/people/100x100/2',
            rating: 5,
            text: '"Excellent service! The team helped me sell my property quickly and at a great price. Highly recommended!"'
        }
    ];

    const features = [
        {
            id: 1,
            icon: 'award',
            title: 'Verified Listings',
            description: 'All properties are verified by our team to ensure authenticity and accuracy.'
        },
        {
            id: 2,
            icon: 'search',
            title: 'Smart Search',
            description: 'Advanced filters and search algorithms to find properties that match your exact needs.'
        },
        {
            id: 3,
            icon: 'shield',
            title: 'Secure Transactions',
            description: 'Safe and secure property transactions with legal support and documentation.'
        }
    ];

    // Popular Indian cities for dropdown
    const popularCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
        'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
    ];

    // Check if contact form is being submitted
    const isContactSubmitting = status === 'CLIENT_CONTACT_REQUEST';

    return (
        <div className="home-page">
            <main className="home-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-overlay-home"></div>
                    <div className="hero-background-home">
                        <img
                            src="http://static.photos/estate/1200x630/1"
                            alt="Luxury Home"
                            className="hero-image-home"
                        />
                    </div>
                    <div className="hero-content-home">
                        <div className="hero-text-home">
                            <h1 className="hero-title-home">
                                Find Your Perfect <span className="hero-highlight">Property</span> in India
                            </h1>
                            <p className="hero-subtitle-home">
                                Discover thousands of verified properties across India. Buy, rent, or sell with confidence.
                            </p>
                            <div className="hero-buttons">
                                <Link
                                    to="/properties"
                                    className="hero-button primary"
                                >
                                    Browse Properties
                                    <i data-feather="arrow-right" className="hero-button-icon"></i>
                                </Link>
                                <Link
                                    to="/contact"
                                    className="hero-button secondary"
                                >
                                    Contact Us
                                    <i data-feather="phone" className="hero-button-icon"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">{totalProperties || '0+'}</div>
                                <div className="stat-label">Properties</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Cities</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">1000+</div>
                                <div className="stat-label">Happy Clients</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Filters */}
                <section className="search-section">
                    <div className="search-container">
                        <h2 className="search-title">Find Your Dream Property</h2>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <div className="search-grid">
                                <div className="search-field">
                                    <label className="search-label">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={searchFilters.city}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                        placeholder="Enter city name"
                                        list="city-suggestions"
                                    />
                                    <datalist id="city-suggestions">
                                        {popularCities.map(city => (
                                            <option key={city} value={city} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="search-field">
                                    <label className="search-label">Property Type</label>
                                    <select
                                        name="propertyType"
                                        value={searchFilters.propertyType}
                                        onChange={handleSearchChange}
                                        className="search-select"
                                    >
                                        <option value="">All Types</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="villa">Villa</option>
                                        <option value="plot">Plot/Land</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="search-field">
                                    <label className="search-label">Price Range</label>
                                    <select
                                        name="priceRange"
                                        value={searchFilters.priceRange}
                                        onChange={handleSearchChange}
                                        className="search-select"
                                    >
                                        <option value="">Any Price</option>
                                        <option value="100000-5000000">₹10L - ₹50L</option>
                                        <option value="5000000-10000000">₹50L - ₹1Cr</option>
                                        <option value="10000000-50000000">₹1Cr - ₹5Cr</option>
                                        <option value="50000000-100000000">₹5Cr - ₹10Cr</option>
                                    </select>
                                </div>
                                <div className="search-button-container">
                                    <button type="submit" className="search-button">
                                        <i data-feather="search"></i>
                                        <span>Search Properties</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Featured Properties */}
                <section id="properties" className="properties-section">
                    <div className="section-header">
                        <h2 className="section-title">Featured Properties</h2>
                        <Link to="/properties" className="view-all-link">
                            View all {totalProperties || 0} properties
                            <i data-feather="arrow-right"></i>
                        </Link>
                    </div>

                    {loading && status === 'FETCH_USER_PROPERTIES_REQUEST' ? (
                        <div className="loading-container">
                            <div className="loading-spinner">
                                <i data-feather="loader" className="animate-spin"></i>
                            </div>
                            <p>Loading properties...</p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {featuredProperties?.map(property => (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    image={property.image}
                                    price={property.price}
                                    address={property.address}
                                    beds={property.beds}
                                    baths={property.baths}
                                    sqft={property.sqft}
                                    type={property.type}
                                    status={property.status}
                                    linkTo={`/properties/view/${property.id}`}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Why Choose Us */}
                <section className="features-section">
                    <h2 className="section-title text-center">Why Choose Us</h2>
                    <div className="features-grid">
                        {features.map(feature => (
                            <div key={feature.id} className="feature-card">
                                <div className="feature-icon-container">
                                    <i data-feather={feature.icon} className="feature-icon"></i>
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials */}
                <section className="testimonials-section">
                    <h2 className="section-title text-center">What Our Clients Say</h2>
                    <div className="testimonials-grid">
                        {testimonials.map(testimonial => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div className="testimonial-header">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="testimonial-avatar"
                                    />
                                    <div>
                                        <h4 className="testimonial-name">{testimonial.name}</h4>
                                        <div className="testimonial-rating">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    data-feather="star"
                                                    className="star-icon"
                                                ></i>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="testimonial-text">{testimonial.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section id="contact" className="contact-section">
                    <div className="contact-container">
                        <div className="contact-info">
                            <h2 className="contact-title">Get In Touch</h2>
                            <p className="contact-description">
                                Looking for a property or want to list yours? Our team is here to help you find the perfect match.
                            </p>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <i data-feather="phone" className="contact-icon"></i>
                                    <span>+91 98765 43210</span>
                                </div>
                                <div className="contact-item">
                                    <i data-feather="mail" className="contact-icon"></i>
                                    <span>info@propertyfinder.com</span>
                                </div>
                                <div className="contact-item">
                                    <i data-feather="map-pin" className="contact-icon"></i>
                                    <span>Mumbai, Maharashtra, India</span>
                                </div>
                            </div>
                        </div>
                        <div className="contact-form-container">
                            {contactSubmitSuccess && (
                                <div className="success-message">
                                    <i data-feather="check-circle" className="success-icon"></i>
                                    <div>
                                        <h3 className="success-title">Message Sent Successfully!</h3>
                                        <p className="success-text">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleContactSubmit} className="contact-form">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                                        placeholder="Enter your full name"
                                        disabled={isContactSubmitting}
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
                                        disabled={isContactSubmitting}
                                    />
                                    {formErrors.email && (
                                        <p className="error-message">{formErrors.email}</p>
                                    )}
                                </div>

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
                                        disabled={isContactSubmitting}
                                    />
                                    {formErrors.phoneNumber && (
                                        <p className="error-message">{formErrors.phoneNumber}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Your Message *</label>
                                    <textarea
                                        name="message"
                                        value={contactForm.message}
                                        onChange={handleContactChange}
                                        rows="4"
                                        className={`form-input ${formErrors.message ? 'input-error' : ''}`}
                                        placeholder="Tell us about your property requirements..."
                                        disabled={isContactSubmitting}
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
                                    disabled={isContactSubmitting}
                                >
                                    {isContactSubmitting ? (
                                        <>
                                            <i data-feather="loader" className="animate-spin button-icon"></i>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;