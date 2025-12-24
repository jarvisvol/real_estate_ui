import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPropertyDetails } from '../store/actions'; // Make sure this action exists
import '../css/PropertyViewPage.css';

const PropertyViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get property data from Redux store - UPDATED selector
    const { propertyDetails, detailsLoading, detailsError } = useSelector((state) =>  state.property );
    // Choose the correct slice name based on your Redux store structure
    
    const [saved, setSaved] = useState(false);
    const [property, setProperty] = useState(null);

    useEffect(() => {
        if (id) {
            // Fetch property data from Redux action
            dispatch(fetchUserPropertyDetails(id));
        }
        
        // Check if property is saved
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        setSaved(savedProperties.includes(id));
    }, [id, dispatch]);

    useEffect(() => {
        // Set property from Redux store when it's loaded
        if (propertyDetails && propertyDetails._id === id) {
            setProperty(propertyDetails);
        }
    }, [propertyDetails, id]);

    const handleSaveProperty = () => {
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        
        if (!savedProperties.includes(id)) {
            savedProperties.push(id);
            localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
            setSaved(true);
            alert('Property saved to favorites!');
        } else {
            const updatedSaved = savedProperties.filter(propId => propId !== id);
            localStorage.setItem('savedProperties', JSON.stringify(updatedSaved));
            setSaved(false);
            alert('Property removed from favorites!');
        }
    };

    const handleShareProperty = () => {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Failed to copy link'));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleScheduleTour = () => {
        // Navigate to schedule tour page or open modal
        navigate(`/schedule-tour/${id}`);
    };

    // const handleContactAgent = () => {
    //     // Open contact form or modal
    //     const agentPhone = property?.createdBy?.phoneNumber;
    //     const agentEmail = property?.createdBy?.email;
        
    //     if (agentPhone) {
    //         window.location.href = `tel:${agentPhone}`;
    //     } else if (agentEmail) {
    //         window.location.href = `mailto:${agentEmail}`;
    //     } else {
    //         alert('Agent contact information not available');
    //     }
    // };

    if (detailsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (detailsError || !property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Property not found</h2>
                    <p className="text-gray-600 mb-6">
                        {detailsError || "The property you're looking for doesn't exist or has been removed."}
                    </p>
                    <button 
                        onClick={handleBack}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        Back to Properties
                    </button>
                </div>
            </div>
        );
    }

    // Helper function to get feature icon
    const getFeatureIcon = (feature) => {
        const icons = {
            propertyType: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            squareFeet: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
            ),
            builtUpArea: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
            yearBuilt: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            bathrooms: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
            ),
            bedrooms: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            lotSize: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                </svg>
            ),
            garage: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        };
        return icons[feature] || icons.propertyType;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                        <button
                            onClick={handleBack}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                        <span className="text-gray-400">/</span>
                        <button
                            onClick={() => navigate('/properties')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Properties
                        </button>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium truncate max-w-xs">
                            {property?.propertyAddress?.streetAddress || 'Property Details'}
                        </span>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                {/* Property Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {property?.propertyAddress?.streetAddress || 'Property Address'}
                            </h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>
                                    {property?.propertyAddress?.city}, {property?.propertyAddress?.state} {property?.propertyAddress?.zipCode}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleSaveProperty}
                                className={`p-2 rounded-lg border ${saved ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                title={saved ? 'Remove from favorites' : 'Save to favorites'}
                            >
                                <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                            
                            <button
                                onClick={handleShareProperty}
                                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                title="Share property"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {property?.price?.currency || '₹'}{property?.price?.amount?.toLocaleString() || '0'}
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            property?.price?.priceType === 'sale' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {property?.price?.priceType === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                    </div>
                </div>

                {/* Property Images Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-64 md:h-96 bg-gray-100 flex items-center justify-center">
                                {property?.images?.[0]?.url ? (
                                    <img 
                                        src={property.images[0].url} 
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            
                            {/* Thumbnail Gallery */}
                            {property?.images && property.images.length > 1 && (
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex space-x-2 overflow-x-auto">
                                        {property.images.map((image, index) => (
                                            <div key={index} className="flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden">
                                                <img 
                                                    src={image.url} 
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Property Details Sidebar */}
                    <div className="space-y-6">
                        {/* Property Features */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                            {getFeatureIcon('squareFeet')}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Plot Area</p>
                                            <p className="font-medium">{property?.dimensions?.plotArea?.value || '0'} {property?.dimensions?.plotArea?.unit || 'sqft'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {property?.dimensions?.builtUpArea?.value && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                                {getFeatureIcon('builtUpArea')}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Built-up Area</p>
                                                <p className="font-medium">
                                                    {property.dimensions.builtUpArea.value} {property.dimensions.builtUpArea.unit || 'sqft'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {property?.distanceFromTransport?.railwayStation && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-green-50 p-2 rounded-lg mr-3">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Nearest Railway Station</p>
                                                <p className="font-medium">
                                                    {property.distanceFromTransport.railwayStation.nearestStationName} ({property.distanceFromTransport.railwayStation.distance}km)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {property?.distanceFromTransport?.busStand && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l-4-4m0 0l4-4m-4 4h18M4 12h18" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Nearest Bus Stand</p>
                                                <p className="font-medium">
                                                    {property.distanceFromTransport.busStand.nearestBusStandName} ({property.distanceFromTransport.busStand.distance}km)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Agent Contact */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Listed By</h2>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-blue-600 font-bold text-lg">
                                        {property?.createdBy?.name?.charAt(0) || 'A'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{property?.createdBy?.name || 'Agent'}</h3>
                                    <p className="text-sm text-gray-500">Property Owner</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {property?.createdBy?.phoneNumber && (
                                    <button
                                        onClick={() => window.location.href = `tel:${property.createdBy.phoneNumber}`}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Call Owner
                                    </button>
                                )}
                                
                                {property?.createdBy?.email && (
                                    <button
                                        onClick={() => window.location.href = `mailto:${property.createdBy.email}`}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email Owner
                                    </button>
                                )}
                                
                                <button
                                    onClick={handleScheduleTour}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Schedule Tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Description */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Description</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700">
                            {property?.description || `This property is located in ${property?.propertyAddress?.city}, ${property?.propertyAddress?.state}. 
                            With a plot area of ${property?.dimensions?.plotArea?.value || '0'} ${property?.dimensions?.plotArea?.unit || 'sqft'}, 
                            it offers great potential for development or residential use.`}
                        </p>
                    </div>
                </div>

                {/* Location Map */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                    <div className="h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-gray-500">Location map will be displayed here</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>
                            {property?.propertyAddress?.streetAddress}, {property?.propertyAddress?.city}, {property?.propertyAddress?.state} {property?.propertyAddress?.zipCode}
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PropertyViewPage;