import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/PropertyCard.css';
import feather from 'feather-icons';

const PropertyCard = ({
    image = 'http://static.photos/estate/640x360',
    amount,
    city,
    street,
    beds = '0',
    baths = '0',
    sqft,
    type = 'Property',
    linkTo
}) => {
    
    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, []);

    return (
        <Link to={linkTo} className="property-card-link">
            <div className="property-card">
                <div 
                    className="property-image"
                    style={{ backgroundImage: `url('${image}')` }}
                />
                
                <div className="property-details">
                    <div className="property-price">{amount}</div>
                    <div className="property-address">{city}-{street}</div>
                    <div className="property-type">{type}</div>
                    
                    <div className="property-features">
                        <div className="feature">
                            <i data-feather="home"></i>
                            <span>{beds} beds</span>
                        </div>
                        <div className="feature">
                            <i data-feather="droplet"></i>
                            <span>{baths} baths</span>
                        </div>
                        <div className="feature">
                            <i data-feather="maximize-2"></i>
                            <span>{sqft} sqft</span>
                        </div>
                    </div>
                    
                    {/* Additional optional button */}
                    <button className="property-button">
                        View Details
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;