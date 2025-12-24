import React, { useState, useEffect } from 'react';
import '../css/PropertyGallery.css';
import feather from 'feather-icons';

const PropertyGallery = ({ 
    images = [
        'http://static.photos/estate/1200x800/1',
        'http://static.photos/estate/1200x800/2',
        'http://static.photos/estate/1200x800/3',
        'http://static.photos/estate/1200x800/4'
    ],
    thumbnails = [
        'http://static.photos/estate/300x200/1',
        'http://static.photos/estate/300x200/2',
        'http://static.photos/estate/300x200/3',
        'http://static.photos/estate/300x200/4'
    ],
    propertyStatus = 'For Sale',
    distances = {
        busStand: '350m away',
        railwayStation: '1.2km away',
        airport: '15km away',
        shoppingMall: '800m away'
    },
    mapLocation = {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Mumbai, Maharashtra'
    }
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, []);

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex + 1) % images.length
        );
    };

    // const handleMapClick = () => {
    //     // Open Google Maps with the property location
    //     const { lat, lng } = mapLocation;
    //     const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    //     window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    // };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className={`property-gallery ${isFullscreen ? 'fullscreen' : ''}`}>
            {/* Main Gallery Container */}
            <div className="gallery-container">
                {/* Property Status Badge */}
                <div className="property-badge">
                    <i data-feather="tag"></i>
                    <span>{propertyStatus}</span>
                </div>

                {/* Image Counter */}
                <div className="image-counter">
                    <i data-feather="camera"></i>
                    <span>{currentIndex + 1}/{images.length}</span>
                </div>

                {/* Fullscreen Toggle */}
                <button 
                    className="fullscreen-toggle"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                    <i data-feather={isFullscreen ? 'minimize' : 'maximize'}></i>
                </button>

                {/* Main Image */}
                <img 
                    src={images[currentIndex]} 
                    alt={`Property view ${currentIndex + 1}`}
                    className="main-image"
                    loading="lazy"
                />

                {/* Navigation Buttons */}
                <div className="gallery-nav">
                    <button 
                        className="nav-btn prev-btn"
                        onClick={handlePrevClick}
                        aria-label="Previous image"
                    >
                        <i data-feather="chevron-left"></i>
                    </button>
                    <button 
                        className="nav-btn next-btn"
                        onClick={handleNextClick}
                        aria-label="Next image"
                    >
                        <i data-feather="chevron-right"></i>
                    </button>
                </div>
            </div>

            {/* Thumbnail Container */}
            <div className="thumbnail-container">
                {thumbnails.map((thumbnail, index) => (
                    <div 
                        key={index}
                        className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => handleThumbnailClick(index)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View image ${index + 1}`}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleThumbnailClick(index);
                            }
                        }}
                    >
                        <img 
                            src={thumbnail} 
                            alt={`Thumbnail ${index + 1}`}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* Distance Information */}
            <div className="distance-info">
                <div className="distance-item">
                    <div className="distance-icon">
                        <i data-feather="bus"></i>
                    </div>
                    <div className="distance-text">
                        <div className="distance-label">Bus Stand</div>
                        <div className="distance-value">{distances.busStand}</div>
                    </div>
                </div>
                <div className="distance-item">
                    <div className="distance-icon">
                        <i data-feather="train"></i>
                    </div>
                    <div className="distance-text">
                        <div className="distance-label">Railway Station</div>
                        <div className="distance-value">{distances.railwayStation}</div>
                    </div>
                </div>
                <div className="distance-item">
                    <div className="distance-icon">
                        <i data-feather="plane"></i>
                    </div>
                    <div className="distance-text">
                        <div className="distance-label">Airport</div>
                        <div className="distance-value">{distances.airport}</div>
                    </div>
                </div>
                <div className="distance-item">
                    <div className="distance-icon">
                        <i data-feather="shopping-bag"></i>
                    </div>
                    <div className="distance-text">
                        <div className="distance-label">Shopping Mall</div>
                        <div className="distance-value">{distances.shoppingMall}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyGallery;