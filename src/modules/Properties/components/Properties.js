import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../../common/components/PropertyCard'
import '../css/Properties.css';
import feather from 'feather-icons';

const PropertiesPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        sortBy: 'Newest First',
        minPrice: 'Min',
        maxPrice: 'Max',
        bedrooms: 'Any',
        bathrooms: 'Any'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Load properties data
        loadProperties();
    }, [currentPage]);

    const loadProperties = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockProperties = [
                {
                    id: 1,
                    image: 'http://static.photos/estate/640x360/1',
                    price: '$450,000',
                    address: '123 Dream Street, New York',
                    beds: 3,
                    baths: 2,
                    sqft: '1,850',
                    type: 'House',
                    status: 'For Sale',
                    favorite: false
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
                    status: 'For Sale',
                    favorite: true
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
                    status: 'For Sale',
                    favorite: false
                },
                {
                    id: 4,
                    image: 'http://static.photos/estate/640x360/4',
                    price: '$275,000',
                    address: '101 Downtown, Austin',
                    beds: 2,
                    baths: 2,
                    sqft: '1,350',
                    type: 'Condo',
                    status: 'For Sale',
                    favorite: false
                },
                {
                    id: 5,
                    image: 'http://static.photos/estate/640x360/5',
                    price: '$650,000',
                    address: '202 Forest Lane, Seattle',
                    beds: 3,
                    baths: 2.5,
                    sqft: '2,100',
                    type: 'House',
                    status: 'For Sale',
                    favorite: false
                },
                {
                    id: 6,
                    image: 'http://static.photos/estate/640x360/6',
                    price: '$380,000',
                    address: '303 Park Ave, Boston',
                    beds: 2,
                    baths: 2,
                    sqft: '1,450',
                    type: 'Apartment',
                    status: 'For Sale',
                    favorite: false
                },
                {
                    id: 7,
                    image: 'http://static.photos/estate/640x360/7',
                    price: '$525,000',
                    address: '404 Lake View, Denver',
                    beds: 3,
                    baths: 2,
                    sqft: '1,950',
                    type: 'House',
                    status: 'For Sale',
                    favorite: false
                },
                {
                    id: 8,
                    image: 'http://static.photos/estate/640x360/8',
                    price: '$210,000',
                    address: '505 City Center, Atlanta',
                    beds: 1,
                    baths: 1,
                    sqft: '900',
                    type: 'Condo',
                    status: 'For Sale',
                    favorite: false
                }
            ];
            setProperties(mockProperties);
            setLoading(false);
        }, 800);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyFilters = () => {
        console.log('Applying filters:', filters);
        setCurrentPage(1);
        // In a real app, you would fetch filtered properties from API
    };

    const handleResetFilters = () => {
        setFilters({
            sortBy: 'Newest First',
            minPrice: 'Min',
            maxPrice: 'Max',
            bedrooms: 'Any',
            bathrooms: 'Any'
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFavoriteToggle = (propertyId, isFavorite) => {
        console.log(`Property ${propertyId} favorite: ${isFavorite}`);
        // Update local state
        setProperties(prev => prev.map(property => 
            property.id === propertyId 
                ? { ...property, favorite: isFavorite }
                : property
        ));
    };

    const totalPages = 3; // This would come from API in real app

    const renderPagination = () => {
        const pages = [];
        
        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
            >
                <i data-feather="chevron-left"></i>
            </button>
        );

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="pagination-button"
            >
                <i data-feather="chevron-right"></i>
            </button>
        );

        return pages;
    };

    return (
        <div className="properties-page">
            <main className="properties-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">Our Property Listings</h1>
                    <p className="page-subtitle">
                        Browse through our carefully curated selection of homes and find your perfect match.
                    </p>
                </div>

                {/* Advanced Filters */}
                <div className="filters-container">
                    <div className="filters-grid">
                        {/* Sort By */}
                        <div className="filter-group">
                            <label className="filter-label">Sort By</label>
                            <select 
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Bedrooms</option>
                                <option>Sqft</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <label className="filter-label">Price Range</label>
                            <div className="price-range">
                                <select 
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    className="price-select"
                                >
                                    <option>Min</option>
                                    <option>$100k</option>
                                    <option>$300k</option>
                                    <option>$500k</option>
                                    <option>$1M</option>
                                </select>
                                <span className="price-separator">to</span>
                                <select 
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    className="price-select"
                                >
                                    <option>Max</option>
                                    <option>$300k</option>
                                    <option>$500k</option>
                                    <option>$1M</option>
                                    <option>$5M+</option>
                                </select>
                            </div>
                        </div>

                        {/* Bedrooms */}
                        <div className="filter-group">
                            <label className="filter-label">Bedrooms</label>
                            <select 
                                name="bedrooms"
                                value={filters.bedrooms}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option>Any</option>
                                <option>1+</option>
                                <option>2+</option>
                                <option>3+</option>
                                <option>4+</option>
                            </select>
                        </div>

                        {/* Bathrooms */}
                        <div className="filter-group">
                            <label className="filter-label">Bathrooms</label>
                            <select 
                                name="bathrooms"
                                value={filters.bathrooms}
                                onChange={handleFilterChange}
                                className="filter-select"
                            >
                                <option>Any</option>
                                <option>1+</option>
                                <option>1.5+</option>
                                <option>2+</option>
                                <option>3+</option>
                            </select>
                        </div>

                        {/* Filter Buttons */}
                        <div className="filter-buttons">
                            <button 
                                onClick={handleApplyFilters}
                                className="apply-filters-button"
                            >
                                <i data-feather="filter"></i> 
                                <span>Apply Filters</span>
                            </button>
                            <button 
                                onClick={handleResetFilters}
                                className="reset-filters-button"
                            >
                                <i data-feather="refresh-cw"></i>
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <p className="results-count">
                        Showing <span className="highlight">{properties.length}</span> properties
                    </p>
                    <div className="view-toggle">
                        <button 
                            className="view-toggle-button active"
                            aria-label="Grid view"
                        >
                            <i data-feather="grid"></i>
                        </button>
                        <button 
                            className="view-toggle-button"
                            aria-label="List view"
                        >
                            <i data-feather="list"></i>
                        </button>
                    </div>
                </div>

                {/* Property Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner">
                            <i data-feather="loader" className="animate-spin"></i>
                        </div>
                        <p>Loading properties...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="no-results">
                        <i data-feather="home" className="no-results-icon"></i>
                        <h3>No properties found</h3>
                        <p>Try adjusting your filters or search criteria.</p>
                        <button 
                            onClick={handleResetFilters}
                            className="reset-filters-button"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="properties-grid">
                        {properties.map(property => (
                            <PropertyCard
                                key={property.id}
                                {...property}
                                isFavorite={property.favorite}
                                linkTo={`/property/${property.id}`}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && properties.length > 0 && (
                    <div className="pagination-container">
                        <nav className="pagination">
                            {renderPagination()}
                        </nav>
                        <div className="page-info">
                            Page <span className="current-page">{currentPage}</span> of {totalPages}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PropertiesPage;