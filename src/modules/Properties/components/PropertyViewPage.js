import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../css/PropertyViewPage.css';
import PropertyGallery from './PropertyGallery';
import feather from 'feather-icons';

const PropertyViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Fetch property data
        fetchPropertyData();
    }, [id]);

    const fetchPropertyData = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock property data
            const mockProperty = {
                id,
                title: 'Luxury Family Home in Upper East Side',
                address: '123 Dream Street, New York',
                price: '$1,250,000',
                status: 'For Sale',
                description: `This stunning 4-bedroom, 3.5-bathroom luxury home offers 3,200 sqft of living space in one of New York's most desirable neighborhoods. Recently renovated with high-end finishes throughout, this property features an open-concept living area, gourmet kitchen, and private backyard oasis.
                
The home includes a master suite with walk-in closet and spa-like bathroom, three additional bedrooms, home office, and finished basement. Located just steps from Central Park and top-rated schools, this is the perfect family home in the heart of Manhattan.`,
                features: {
                    propertyType: 'Single Family Home',
                    squareFeet: '3,200 sqft',
                    yearBuilt: '2015',
                    lastRenovation: '2021',
                    bathrooms: '3.5',
                    bedrooms: '4',
                    lotSize: '5,000 sqft',
                    garage: '2-car attached'
                },
                amenities: [
                    'Central Air Conditioning',
                    'Hardwood Floors',
                    'Walk-in Closets',
                    'Gourmet Kitchen',
                    'Smart Home System',
                    'Private Garden',
                    'Garage Parking',
                    'Home Office',
                    'Swimming Pool',
                    'Fireplace',
                    'Wine Cellar',
                    'Roof Deck'
                ],
                images: [
                    'http://static.photos/estate/1200x800/1',
                    'http://static.photos/estate/1200x800/2',
                    'http://static.photos/estate/1200x800/3',
                    'http://static.photos/estate/1200x800/4'
                ],
                thumbnails: [
                    'http://static.photos/estate/300x200/1',
                    'http://static.photos/estate/300x200/2',
                    'http://static.photos/estate/300x200/3',
                    'http://static.photos/estate/300x200/4'
                ],
                distances: {
                    busStand: '350m away',
                    railwayStation: '1.2km away',
                    airport: '15km away',
                    shoppingMall: '800m away'
                },
                location: {
                    lat: 40.748440,
                    lng: -73.987844,
                    address: '123 Dream Street, New York, NY 10001',
                    googleMapsUrl: 'https://goo.gl/maps/example'
                },
                agent: {
                    name: 'Sarah Johnson',
                    title: 'Senior Real Estate Agent',
                    phone: '(555) 123-4567',
                    email: 'sarah@homehaven.com',
                    avatar: 'http://static.photos/people/100x100/42',
                    bio: 'With over 15 years of experience in New York real estate, Sarah has helped hundreds of families find their dream homes.',
                    rating: 4.9,
                    propertiesSold: 245
                },
                similarProperties: [
                    {
                        id: 2,
                        title: 'Modern Penthouse in Manhattan',
                        price: '$2,100,000',
                        address: '456 Park Ave, New York',
                        beds: 3,
                        baths: 3,
                        sqft: '2,800'
                    },
                    {
                        id: 3,
                        title: 'Townhouse in Brooklyn Heights',
                        price: '$1,800,000',
                        address: '789 Brooklyn Blvd, Brooklyn',
                        beds: 4,
                        baths: 3.5,
                        sqft: '3,500'
                    }
                ]
            };

            setProperty(mockProperty);
        } catch (error) {
            console.error('Error fetching property:', error);
            navigate('/properties');
        } finally {
            setLoading(false);
        }
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
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

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateContactForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        setSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success message
            alert('Message sent successfully! Our agent will contact you shortly.');
            
            // Reset form
            setContactForm({
                name: '',
                email: '',
                phone: '',
                message: ''
            });
            setFormErrors({});
        } catch (error) {
            alert('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveProperty = () => {
        // Save property to favorites
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        if (!savedProperties.includes(id)) {
            savedProperties.push(id);
            localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
            alert('Property saved to favorites!');
        } else {
            alert('Property already saved!');
        }
    };

    const handleShareProperty = () => {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Failed to copy link'));
    };

    if (loading) {
        return (
            <div className="property-loading">
                <div className="loading-spinner">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="property-not-found">
                <h2>Property not found</h2>
                <Link to="/properties" className="back-button">
                    Back to Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="property-view-page">            
            <main className="property-container">
                {/* Breadcrumb Navigation */}
                <nav className="property-breadcrumb">
                    <Link to="/" className="breadcrumb-link">Home</Link>
                    <i data-feather="chevron-right" className="breadcrumb-icon"></i>
                    <Link to="/properties" className="breadcrumb-link">Properties</Link>
                    <i data-feather="chevron-right" className="breadcrumb-icon"></i>
                    <span className="breadcrumb-current">{property.address}</span>
                </nav>

                {/* Property Header */}
                <header className="property-header">
                    <div className="property-header-top">
                        <h1 className="property-title">{property.title}</h1>
                        <div className="property-actions">
                            <button 
                                className="property-action-button"
                                onClick={handleSaveProperty}
                                aria-label="Save property"
                            >
                                <i data-feather="bookmark"></i>
                                <span>Save</span>
                            </button>
                            <button 
                                className="property-action-button"
                                onClick={handleShareProperty}
                                aria-label="Share property"
                            >
                                <i data-feather="share-2"></i>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="property-header-bottom">
                        <div className="property-price">{property.price}</div>
                        <div className="property-status">{property.status}</div>
                        <div className="property-address">
                            <i data-feather="map-pin" className="address-icon"></i>
                            <span>{property.address}</span>
                        </div>
                    </div>
                </header>

                {/* Property Gallery */}
                <div className="property-gallery-section">
                    <PropertyGallery 
                        images={property.images}
                        thumbnails={property.thumbnails}
                        propertyStatus={property.status}
                        distances={property.distances}
                        mapLocation={property.location}
                    />
                </div>

                {/* Property Details Grid */}
                <div className="property-details-grid">
                    <div className="property-main-content">
                        {/* Description Section */}
                        <section className="property-section">
                            <h2 className="section-title">Property Description</h2>
                            <div className="property-description">
                                {property.description.split('\n').map((paragraph, index) => (
                                    <p key={index} className="description-paragraph">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>

                        {/* Features Section */}
                        <section className="property-section">
                            <h2 className="section-title">Property Features</h2>
                            <div className="features-grid">
                                {Object.entries(property.features).map(([key, value]) => (
                                    <div key={key} className="feature-item">
                                        <div className="feature-icon-container">
                                            <i data-feather={getFeatureIcon(key)} className="feature-icon"></i>
                                        </div>
                                        <div className="feature-content">
                                            <div className="feature-label">
                                                {formatFeatureLabel(key)}
                                            </div>
                                            <div className="feature-value">
                                                {value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Amenities Section */}
                        <section className="property-section">
                            <div className="section-header">
                                <h2 className="section-title">Amenities</h2>
                                <span className="amenities-count">
                                    {property.amenities.length} amenities
                                </span>
                            </div>
                            <div className="amenities-grid">
                                {property.amenities.map((amenity, index) => (
                                    <div key={index} className="amenity-item">
                                        <i data-feather="check" className="amenity-check"></i>
                                        <span className="amenity-text">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="property-sidebar">
                        {/* Contact Form */}
                        <div className="sidebar-card">
                            <h2 className="sidebar-title">Contact Agent</h2>
                            <form onSubmit={handleContactSubmit} className="contact-form">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={contactForm.name}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                                        placeholder="Your Name"
                                        aria-label="Your Name"
                                    />
                                    {formErrors.name && (
                                        <span className="error-message">{formErrors.name}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactForm.email}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                                        placeholder="Email Address"
                                        aria-label="Email Address"
                                    />
                                    {formErrors.email && (
                                        <span className="error-message">{formErrors.email}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={contactForm.phone}
                                        onChange={handleContactChange}
                                        className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                                        placeholder="Phone Number"
                                        aria-label="Phone Number"
                                    />
                                    {formErrors.phone && (
                                        <span className="error-message">{formErrors.phone}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="message"
                                        value={contactForm.message}
                                        onChange={handleContactChange}
                                        className={`form-textarea ${formErrors.message ? 'input-error' : ''}`}
                                        placeholder="Message"
                                        rows="4"
                                        aria-label="Message"
                                    ></textarea>
                                    {formErrors.message && (
                                        <span className="error-message">{formErrors.message}</span>
                                    )}
                                </div>
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <i data-feather="loader" className="animate-spin mr-2"></i>
                                            Sending...
                                        </>
                                    ) : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        {/* Agent Card */}
                        <div className="sidebar-card">
                            <h2 className="sidebar-title">Listing Agent</h2>
                            <div className="agent-card">
                                <img 
                                    src={property.agent.avatar} 
                                    alt={property.agent.name}
                                    className="agent-avatar"
                                />
                                <div className="agent-info">
                                    <h3 className="agent-name">{property.agent.name}</h3>
                                    <p className="agent-title">{property.agent.title}</p>
                                    <div className="agent-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i 
                                                key={i} 
                                                data-feather="star" 
                                                className={`star-icon ${i < Math.floor(property.agent.rating) ? 'filled' : ''}`}
                                            ></i>
                                        ))}
                                        <span className="rating-number">{property.agent.rating}</span>
                                    </div>
                                    <div className="agent-stats">
                                        <span className="stat-item">
                                            <i data-feather="home"></i>
                                            {property.agent.propertiesSold} sold
                                        </span>
                                    </div>
                                    <div className="agent-contact">
                                        <a href={`tel:${property.agent.phone}`} className="contact-link">
                                            <i data-feather="phone"></i>
                                            {property.agent.phone}
                                        </a>
                                        <a href={`mailto:${property.agent.email}`} className="contact-link">
                                            <i data-feather="mail"></i>
                                            {property.agent.email}
                                        </a>
                                    </div>
                                    <button className="agent-button">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="sidebar-card map-card">
                            <h2 className="sidebar-title">Location</h2>
                            <div className="map-container">
                                <iframe
                                    title="Property Location Map"
                                    src={`https://maps.google.com/maps?q=${property.location.lat},${property.location.lng}&z=15&output=embed`}
                                    className="map-iframe"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            <div className="map-info">
                                <i data-feather="map-pin" className="map-icon"></i>
                                <div className="map-address">
                                    {property.location.address}
                                </div>
                            </div>
                        </div>

                        {/* Schedule Tour */}
                        <div className="sidebar-card tour-card">
                            <h2 className="sidebar-title">Schedule a Tour</h2>
                            <p className="tour-description">
                                Schedule a private viewing of this property
                            </p>
                            <button className="tour-schedule-button">
                                <i data-feather="calendar"></i>
                                Schedule Tour
                            </button>
                        </div>
                    </aside>
                </div>

                {/* Similar Properties */}
                <section className="similar-properties">
                    <h2 className="section-title">Similar Properties</h2>
                    <div className="similar-grid">
                        {/* You can use your PropertyCard component here */}
                        <div className="similar-notice">
                            <i data-feather="home" className="similar-icon"></i>
                            <p>Similar properties will be displayed here</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

// Helper functions
const getFeatureIcon = (feature) => {
    const icons = {
        propertyType: 'home',
        squareFeet: 'maximize-2',
        yearBuilt: 'layers',
        lastRenovation: 'calendar',
        bathrooms: 'droplet',
        bedrooms: 'bed',
        lotSize: 'square',
        garage: 'truck'
    };
    return icons[feature] || 'check';
};

const formatFeatureLabel = (label) => {
    return label
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
};

export default PropertyViewPage;