import React, { useEffect, useState } from 'react';
import PropertyCard from '../../common/components/PropertyCard';
import '../css/Properties.css';
import feather from 'feather-icons';
import { fetchUserProperties, filterUserProperties } from '../store/actions';
import { useSelector, useDispatch } from 'react-redux';

const PropertiesPage = () => {
    const dispatch = useDispatch();
    
    const { 
        properties: propertyData, 
        loading, 
        currentPage, 
        totalPages,
        totalProperties,
        limit,
        filters: reduxFilters
    } = useSelector(state => state.property);
    
    const [localFilters, setLocalFilters] = useState({
        city: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt'
    });

    // Initialize with Redux filters if they exist
    useEffect(() => {
        if (reduxFilters) {
            setLocalFilters(reduxFilters);
        }
    }, [reduxFilters]);

    useEffect(() => {
        dispatch(fetchUserProperties({
            page: currentPage,
            limit: limit,
            ...reduxFilters
        }));
    }, [dispatch, currentPage, limit, reduxFilters]);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, [propertyData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            city: value
        }));
    };


    const handleApplyFilters = () => {
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
            sortBy: 'createdAt'
        };
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
            ...reduxFilters
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

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
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

    return (
        <div className="properties-page">
            <main className="properties-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">Our Property Listings</h1>
                    <p className="page-subtitle">
                        Browse through our carefully curated selection of homes and find your perfect match.
                        {totalProperties > 0 && ` (${totalProperties} properties)`}
                    </p>
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

                        {/* Price Range */}
                        <div className="filter-group">
                            <label className="filter-label">
                                Price Range
                            </label>
                            <div className="price-range">
                                <select 
                                    name="minPrice"
                                    value={localFilters.minPrice}
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
                                    value={localFilters.maxPrice}
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

                        {/* Filter Buttons - Now in same row */}
                        <div className="filter-buttons-container">
                            <button 
                                onClick={handleApplyFilters}
                                className="apply-filters-button"
                                disabled={loading}
                            >
                                <i data-feather="filter"></i> 
                                <span>{loading ? 'Applying...' : 'Apply Filters'}</span>
                            </button>
                            <button 
                                onClick={handleResetFilters}
                                className="reset-filters-button"
                                disabled={loading}
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
                        Showing <span className="highlight">{propertyData?.length || 0}</span> of{' '}
                        <span className="highlight">{totalProperties || 0}</span> properties
                        {localFilters.city && ` in ${localFilters.city}`}
                    </p>
                    <div className="view-toggle">
                        <button 
                            className="view-toggle-button active"
                            aria-label="Grid view"
                            disabled={loading}
                        >
                            <i data-feather="grid"></i>
                        </button>
                        <button 
                            className="view-toggle-button"
                            aria-label="List view"
                            disabled={loading}
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
                ) :
                (
                    <div className="properties-grid">
                        {propertyData?.map(property => (
                            property && property._id && (
                                <PropertyCard
                                    key={property._id}
                                    id={property._id}
                                    // image={property.images?.[0]?.url}
                                    amount={formatPrice(property.price?.amount)}
                                    address={`${property.propertyAddress?.streetAddress || ''}, ${property.propertyAddress?.city || ''}`}
                                    beds="N/A" // Update if you have bedrooms in your data
                                    baths="N/A" // Update if you have bathrooms in your data
                                    sqft={property.dimensions?.plotArea?.value || property.dimensions?.builtUpArea?.value}
                                    type="Property"
                                    linkTo={`/properties/view/${property._id}`}
                                />
                            )
                        ))}
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