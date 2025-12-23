import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../common/components/PropertyCard';
import feather from 'feather-icons';
import '../css/HomePage.css';

const HomePage = () => {
    const [searchFilters, setSearchFilters] = useState({
        location: 'Anywhere',
        propertyType: 'All Types',
        priceRange: 'Any Price'
    });
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, []);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Searching with filters:', searchFilters);
        // Implement search functionality here
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
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
            errors.email = 'Email is invalid';
        }
        
        if (!contactForm.phone.trim()) {
            errors.phone = 'Phone number is required';
        }
        
        if (!contactForm.message.trim()) {
            errors.message = 'Message is required';
        }
        
        return errors;
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        
        const errors = validateContactForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        console.log('Contact form submitted:', contactForm);
        // Implement contact form submission here
        alert('Message sent successfully!');
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setFormErrors({});
    };

    const featuredProperties = [
        {
            id: 1,
            image: 'http://static.photos/estate/640x360/1',
            price: '$450,000',
            address: '123 Dream Street, New York',
            beds: 3,
            baths: 2,
            sqft: '1,850',
            type: 'House',
            status: 'For Sale'
        },
        {
            id: 2,
            image: 'http://static.photos/estate/640x360/2',
            price: '$320,000',
            address: '456 Urban Ave, Chicago',
            beds: 2,
            baths: 1.5,
            sqft: '1,200',
            type: 'Apartment',
            status: 'For Sale'
        },
        {
            id: 3,
            image: 'http://static.photos/estate/640x360/3',
            price: '$1,200,000',
            address: '789 Ocean View, Miami',
            beds: 4,
            baths: 3,
            sqft: '3,200',
            type: 'Villa',
            status: 'For Sale'
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            image: 'http://static.photos/people/100x100/1',
            rating: 5,
            text: '"HomeHaven made finding our dream home so easy! Their agent was knowledgeable and helped us navigate the entire buying process."'
        },
        {
            id: 2,
            name: 'Michael Chen',
            image: 'http://static.photos/people/100x100/2',
            rating: 5,
            text: '"I sold my condo through HomeHaven and got 15% above asking price. Their marketing strategy was exceptional!"'
        }
    ];

    const features = [
        {
            id: 1,
            icon: 'award',
            title: 'Trusted Agents',
            description: 'Our certified agents have years of experience and local market knowledge.'
        },
        {
            id: 2,
            icon: 'home',
            title: 'Wide Selection',
            description: 'Access thousands of properties across all price ranges and locations.'
        },
        {
            id: 3,
            icon: 'dollar-sign',
            title: 'Best Prices',
            description: 'We negotiate the best deals and provide transparent pricing.'
        }
    ];

    return (
        <div className="home-page">
            
            <main className="home-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-overlay"></div>
                    <div className="hero-background">
                        <img 
                            src="http://static.photos/estate/1200x630/1" 
                            alt="Luxury Home" 
                            className="hero-image"
                        />
                    </div>
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Discover Your <span className="hero-highlight">Dream Home</span> Today
                            </h1>
                            <p className="hero-subtitle">
                                Explore our exclusive collection of premium properties tailored to your lifestyle and budget.
                            </p>
                            <div className="hero-buttons">
                                <Link 
                                    to="#properties" 
                                    className="hero-button primary"
                                >
                                    Browse Properties 
                                    <i data-feather="arrow-right" className="hero-button-icon"></i>
                                </Link>
                                <Link 
                                    to="#contact" 
                                    className="hero-button secondary"
                                >
                                    Get Expert Advice 
                                    <i data-feather="phone" className="hero-button-icon"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Filters */}
                <section className="search-section">
                    <div className="search-container">
                        <h2 className="search-title">Refine Your Search</h2>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <div className="search-grid">
                                <div className="search-field">
                                    <label className="search-label">Location</label>
                                    <select 
                                        name="location"
                                        value={searchFilters.location}
                                        onChange={handleSearchChange}
                                        className="search-select"
                                    >
                                        <option>Anywhere</option>
                                        <option>New York</option>
                                        <option>Los Angeles</option>
                                        <option>Chicago</option>
                                        <option>Houston</option>
                                    </select>
                                </div>
                                <div className="search-field">
                                    <label className="search-label">Property Type</label>
                                    <select 
                                        name="propertyType"
                                        value={searchFilters.propertyType}
                                        onChange={handleSearchChange}
                                        className="search-select"
                                    >
                                        <option>All Types</option>
                                        <option>House</option>
                                        <option>Apartment</option>
                                        <option>Condo</option>
                                        <option>Villa</option>
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
                                        <option>Any Price</option>
                                        <option>$100k - $300k</option>
                                        <option>$300k - $500k</option>
                                        <option>$500k - $1M</option>
                                        <option>$1M+</option>
                                    </select>
                                </div>
                                <div className="search-button-container">
                                    <button type="submit" className="search-button">
                                        <i data-feather="search"></i> 
                                        <span>Search</span>
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
                            View all 
                            <i data-feather="arrow-right"></i>
                        </Link>
                    </div>
                    <div className="properties-grid">
                        {featuredProperties.map(property => (
                            <PropertyCard
                                key={property.id}
                                {...property}
                                linkTo={`/property/${property.id}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="features-section">
                    <h2 className="section-title text-center">Why Choose HomeHaven</h2>
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
                                            {[...Array(5)].map((_, i) => (
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
                            <h2 className="contact-title">Contact Our Agents</h2>
                            <p className="contact-description">
                                Have questions or ready to start your property journey? Our team is here to help.
                            </p>
                            <div className="contact-details">
                                <div className="contact-item">
                                    <i data-feather="phone" className="contact-icon"></i>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="contact-item">
                                    <i data-feather="mail" className="contact-icon"></i>
                                    <span>info@homehaven.com</span>
                                </div>
                                <div className="contact-item">
                                    <i data-feather="map-pin" className="contact-icon"></i>
                                    <span>123 Real Estate Ave, Suite 100, New York</span>
                                </div>
                            </div>
                        </div>
                        <div className="contact-form-container">
                            <form onSubmit={handleContactSubmit} className="contact-form">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                                        placeholder="Your name"
                                    />
                                    {formErrors.name && (
                                        <p className="error-message">{formErrors.name}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                                        placeholder="your@email.com"
                                    />
                                    {formErrors.email && (
                                        <p className="error-message">{formErrors.email}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={contactForm.phone}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                                        placeholder="Your phone number"
                                    />
                                    {formErrors.phone && (
                                        <p className="error-message">{formErrors.phone}</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        name="message"
                                        value={contactForm.message}
                                        onChange={handleContactChange}
                                        rows="4"
                                        className={`form-input ${formErrors.message ? 'input-error' : ''}`}
                                        placeholder="Your message"
                                    ></textarea>
                                    {formErrors.message && (
                                        <p className="error-message">{formErrors.message}</p>
                                    )}
                                </div>
                                <button type="submit" className="submit-button">
                                    Send Message
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