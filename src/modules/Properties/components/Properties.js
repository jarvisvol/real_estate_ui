import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import PropertyCard from '../../common/components/PropertyCard';
import '../css/Properties.css';
import feather from 'feather-icons';
import { fetchUserProperties, filterUserProperties } from '../store/actions';
import { useSelector, useDispatch } from 'react-redux';

const PropertiesPage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    
    const { 
        properties: propertyData, 
        loading, 
        currentPage, 
        totalPages,
        totalProperties,
        limit,
        filters: reduxFilters,
    } = useSelector(state => state.property);
    
    const [localFilters, setLocalFilters] = useState({
        city: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt'
    });

    // Read query parameters from URL on component mount and when URL changes
    useEffect(() => {
        const city = searchParams.get('city') || '';
        const minPrice = searchParams.get('minPrice') || '';
        const maxPrice = searchParams.get('maxPrice') || '';
        const propertyType = searchParams.get('propertyType') || '';
        
        const filtersFromURL = {
            city,
            minPrice,
            maxPrice,
            propertyType,
            sortBy: 'createdAt'
        };
        
        // Update local filters with URL params
        setLocalFilters(filtersFromURL);
        
        // Update Redux filters and fetch properties
        dispatch(filterUserProperties(filtersFromURL));
        dispatch(fetchUserProperties({
            page: 1,
            limit: limit,
            ...filtersFromURL
        }));
        
    }, [location.search, dispatch, limit, searchParams]);

    // Sync local filters with Redux filters
    useEffect(() => {
        if (reduxFilters) {
            setLocalFilters(prev => ({
                ...prev,
                ...reduxFilters
            }));
        }
    }, [reduxFilters]);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, [propertyData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = {
            ...localFilters,
            [name]: value
        };
        
        setLocalFilters(updatedFilters);
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            city: value
        }));
    };

    const handleApplyFilters = () => {
        // Update URL with current filters
        const params = new URLSearchParams();
        
        if (localFilters.city) params.set('city', localFilters.city);
        if (localFilters.minPrice) params.set('minPrice', localFilters.minPrice);
        if (localFilters.maxPrice) params.set('maxPrice', localFilters.maxPrice);
        if (localFilters.propertyType) params.set('propertyType', localFilters.propertyType);
        
        // Update URL without page reload
        setSearchParams(params);
        
        // Dispatch filters to Redux and fetch properties
        dispatch(filterUserProperties(localFilters));
        dispatch(fetchUserProperties({
            page: 1, // Reset to first page when applying filters
            limit: limit,
            ...localFilters
        }));
    };

    const handleResetFilters = () => {
        const resetFilters = {
            city: '',
            minPrice: '',
            maxPrice: '',
            propertyType: '',
            sortBy: 'createdAt'
        };
        
        // Clear URL parameters
        setSearchParams(new URLSearchParams());
        
        // Reset filters
        setLocalFilters(resetFilters);
        dispatch(filterUserProperties(resetFilters));
        dispatch(fetchUserProperties({
            page: 1,
            limit: limit,
            ...resetFilters
        }));
    };

    const handlePageChange = (page) => {
        dispatch(fetchUserProperties({
            page: page,
            limit: limit,
            ...localFilters // Use local filters (which should match URL)
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    const renderPagination = () => {
        if (!totalPages || totalPages <= 1) return null;
        
        const pages = [];
        
        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="pagination-button"
            >
                <i data-feather="chevron-left"></i>
            </button>
        );

        // Calculate start and end pages for better pagination
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add first page if needed
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="pagination-number"
                    disabled={loading}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="pagination-dots">...</span>);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                    disabled={loading}
                >
                    {i}
                </button>
            );
        }

        // Add last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="pagination-dots">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="pagination-number"
                    disabled={loading}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || loading}
                className="pagination-button"
            >
                <i data-feather="chevron-right"></i>
            </button>
        );

        return pages;
    };

    // Check if we have any active filters
    const hasActiveFilters = localFilters.city || localFilters.minPrice || localFilters.maxPrice || localFilters.propertyType;

    return (
        <div className="properties-page">
            <main className="properties-container">
                {/* Page Header */}
                <div className="page-header">
                    <p className="page-subtitle">
                        {hasActiveFilters ? (
                            <>Search results based on your filters ({totalProperties || 0} properties)</>
                        ) : (
                            <>Browse through our carefully curated selection of homes ({totalProperties || 0} properties)</>
                        )}
                    </p>
                    
                    {hasActiveFilters && (
                        <div className="active-filters">
                            <span className="active-filters-label">Active Filters:</span>
                            {localFilters.city && (
                                <span className="active-filter-tag">
                                    City: {localFilters.city}
                                </span>
                            )}
                            {(localFilters.minPrice || localFilters.maxPrice) && (
                                <span className="active-filter-tag">
                                    Price: {localFilters.minPrice ? `₹${(localFilters.minPrice/100000).toFixed(1)}L` : 'Any'} - {localFilters.maxPrice ? `₹${(localFilters.maxPrice/10000000).toFixed(1)}Cr` : 'Any'}
                                </span>
                            )}
                            {localFilters.propertyType && (
                                <span className="active-filter-tag">
                                    Type: {localFilters.propertyType}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Advanced Filters */}
                <div className="filters-container">
                    <div className="filters-grid">
                        {/* Search Bar */}
                        <div className="filter-group">
                            <label className="filter-label">
                                Search By City
                            </label>
                            <input 
                                type="text"
                                name="city"
                                value={localFilters.city}
                                onChange={handleSearchChange}
                                placeholder="Enter city name..."
                                className="filter-input"
                                disabled={loading}
                            />
                        </div>

                        {/* Property Type Filter */}
                        <div className="filter-group">
                            <label className="filter-label">
                                Property Type
                            </label>
                            <select 
                                name="propertyType"
                                value={localFilters.propertyType || ''}
                                onChange={handleFilterChange}
                                className="filter-select"
                                disabled={loading}
                            >
                                <option value="">All Types</option>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="villa">Villa</option>
                                <option value="plot">Plot/Land</option>
                                <option value="commercial">Commercial</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <label className="filter-label">
                                Price Range
                            </label>
                            <div className="price-range">
                                <select 
                                    name="minPrice"
                                    value={localFilters.minPrice || ''}
                                    onChange={handleFilterChange}
                                    className="price-select"
                                    disabled={loading}
                                >
                                    <option value="">Min</option>
                                    <option value="100000">₹10L</option>
                                    <option value="3000000">₹30L</option>
                                    <option value="5000000">₹50L</option>
                                    <option value="10000000">₹1Cr</option>
                                </select>
                                <span className="price-separator">to</span>
                                <select 
                                    name="maxPrice"
                                    value={localFilters.maxPrice || ''}
                                    onChange={handleFilterChange}
                                    className="price-select"
                                    disabled={loading}
                                >
                                    <option value="">Max</option>
                                    <option value="3000000">₹30L</option>
                                    <option value="5000000">₹50L</option>
                                    <option value="10000000">₹1Cr</option>
                                    <option value="30000000">₹3Cr</option>
                                </select>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="filter-group">
                            <label className="filter-label">
                                Sort By
                            </label>
                            <select 
                                name="sortBy"
                                value={localFilters.sortBy}
                                onChange={handleFilterChange}
                                className="filter-select"
                                disabled={loading}
                            >
                                <option value="createdAt">Newest First</option>
                                <option value="price.amount">Price: Low to High</option>
                                <option value="-price.amount">Price: High to Low</option>
                                <option value="dimensions.plotArea.value">Largest Plot</option>
                            </select>
                        </div>

                        {/* Filter Buttons */}
                        <div className="filter-buttons-container">
                            <button 
                                onClick={handleApplyFilters}
                                className="apply-filters-button"
                                disabled={loading}
                            >
                                <span>{loading ? 'Applying...' : 'Apply Filters'}</span>
                            </button>
                            <button 
                                onClick={handleResetFilters}
                                className="reset-filters-button"
                                disabled={loading}
                            >
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <p className="results-count">
                        Showing <span className="highlight">{propertyData?.length || 0}</span> of{' '}
                        <span className="highlight">{totalProperties || 0}</span> properties
                        {localFilters.city && ` in ${localFilters.city}`}
                    </p>
                </div>

                {/* Property Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner">
                            <i data-feather="loader" className="animate-spin"></i>
                        </div>
                        <p>Loading properties...</p>
                    </div>
                ) : (
                    <div className="properties-grid">
                        {propertyData && propertyData.length > 0 ? (
                            propertyData.map(property => (
                                property && property._id && (
                                    <PropertyCard
                                        key={property._id}
                                        id={property._id}
                                        image={property.images?.[0]?.url}
                                        price={formatPrice(property.price?.amount)}
                                        address={`${property.propertyAddress?.streetAddress || ''}, ${property.propertyAddress?.city || ''}`}
                                        beds={property.features?.bedrooms || 'N/A'}
                                        baths={property.features?.bathrooms || 'N/A'}
                                        sqft={property.dimensions?.plotArea?.value || property.dimensions?.builtUpArea?.value}
                                        type={property.features?.propertyType || 'Property'}
                                        status={property.price?.priceType === 'sale' ? 'For Sale' : 'For Rent'}
                                        linkTo={`/properties/view/${property._id}`}
                                    />
                                )
                            ))
                        ) : (
                            <div className="no-properties-message">
                                <i data-feather="home" className="no-properties-icon"></i>
                                <h3>No Properties Found</h3>
                                <p>
                                    {hasActiveFilters 
                                        ? 'No properties match your search criteria. Try adjusting your filters.'
                                        : 'No properties available at the moment. Please check back later.'
                                    }
                                </p>
                                {hasActiveFilters && (
                                    <button 
                                        onClick={handleResetFilters}
                                        className="reset-filters-button"
                                    >
                                        <i data-feather="refresh-cw"></i>
                                        Reset Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!loading && propertyData?.length > 0 && totalPages > 1 && (
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