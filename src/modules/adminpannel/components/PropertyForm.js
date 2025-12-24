import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createProperty, 
  updateProperty,
  clearPropertyError, 
  resetPropertyState 
} from '../store/adminActions';
import {fetchUserPropertyDetails} from '../../Properties/store/actions'

const PropertyForm = ({ isEditMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get property ID from URL for edit mode

  // Get state from Redux store using useSelector
  const { error, success, loading } = useSelector((state) => state.admin);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { propertyDetails } = useSelector((state) => state.property);

  const [propertyData, setPropertyData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    currency: 'INR',
    amount: '',
    priceType: 'sale',
    pricePerSquareUnit: '',
    plotArea: '',
    builtUpArea: '',
    nearestStationName: '',
    railwayDistance: '',
    nearestBusStandName: '',
    busDistance: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Redirect if not authenticated as admin/agent
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!['admin', 'agent'].includes(user?.role)) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch property details for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchUserPropertyDetails(id));
    }
  }, [isEditMode, id, dispatch]);

  // Populate form data when propertyDetails is loaded
  useEffect(() => {
    if (isEditMode && propertyDetails && propertyDetails._id === id) {
      // Format data from API to match form state
      const formattedData = {
        streetAddress: propertyDetails.propertyAddress?.streetAddress || '',
        city: propertyDetails.propertyAddress?.city || '',
        state: propertyDetails.propertyAddress?.state || '',
        zipCode: propertyDetails.propertyAddress?.zipCode || '',
        country: propertyDetails.propertyAddress?.country || 'India',
        currency: propertyDetails.price?.currency || 'INR',
        amount: propertyDetails.price?.amount?.toString() || '',
        priceType: propertyDetails.price?.priceType || 'sale',
        pricePerSquareUnit: propertyDetails.price?.pricePerSquareUnit?.toString() || '',
        plotArea: propertyDetails.dimensions?.plotArea?.value?.toString() || '',
        builtUpArea: propertyDetails.dimensions?.builtUpArea?.value?.toString() || '',
        nearestStationName: propertyDetails.distanceFromTransport?.railwayStation?.nearestStationName || '',
        railwayDistance: propertyDetails.distanceFromTransport?.railwayStation?.distance?.toString() || '',
        nearestBusStandName: propertyDetails.distanceFromTransport?.busStand?.nearestBusStandName || '',
        busDistance: propertyDetails.distanceFromTransport?.busStand?.distance?.toString() || ''
      };
      
      setPropertyData(formattedData);
      setExistingImages(propertyDetails.images || []);
    }
  }, [propertyDetails, isEditMode, id]);

  // Handle success state
  useEffect(() => {
    if (success) {
      if (isEditMode) {
        alert('Property updated successfully!');
      } else {
        alert('Property created successfully!');
      }
      
      // Reset form after successful creation/update
      setPropertyData({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        currency: 'INR',
        amount: '',
        priceType: 'sale',
        pricePerSquareUnit: '',
        plotArea: '',
        builtUpArea: '',
        nearestStationName: '',
        railwayDistance: '',
        nearestBusStandName: '',
        busDistance: ''
      });
      setSelectedImages([]);
      setExistingImages([]);
      setRemovedImages([]);
      setFormErrors({});
      dispatch(resetPropertyState());
      
      // Navigate back to properties list
      navigate('/admin/properties');
    }
  }, [success, dispatch, navigate, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (max 5MB)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      alert('Some files exceed 5MB limit');
    }
    
    setSelectedImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId, imageUrl) => {
    // Add to removed images list
    setRemovedImages(prev => [...prev, { _id: imageId, url: imageUrl }]);
    // Remove from existing images list
    setExistingImages(prev => prev.filter(img => img._id !== imageId));
  };

  const restoreExistingImage = (imageId) => {
    // Remove from removed images list
    setRemovedImages(prev => prev.filter(img => img._id !== imageId));
    // Add back to existing images list
    const restoredImage = removedImages.find(img => img._id === imageId);
    if (restoredImage) {
      setExistingImages(prev => [...prev, restoredImage]);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!propertyData.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required';
    }
    if (!propertyData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!propertyData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!propertyData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }
    if (!propertyData.country.trim()) {
      errors.country = 'Country is required';
    }
    
    // Price validation
    if (!propertyData.amount || parseFloat(propertyData.amount) <= 0) {
      errors.amount = 'Valid price is required';
    }
    
    // Numeric field validation
    if (propertyData.plotArea && parseFloat(propertyData.plotArea) < 0) {
      errors.plotArea = 'Plot area must be positive';
    }
    
    if (propertyData.builtUpArea && parseFloat(propertyData.builtUpArea) < 0) {
      errors.builtUpArea = 'Built-up area must be positive';
    }
    
    if (propertyData.railwayDistance && parseFloat(propertyData.railwayDistance) < 0) {
      errors.railwayDistance = 'Distance must be positive';
    }
    
    if (propertyData.busDistance && parseFloat(propertyData.busDistance) < 0) {
      errors.busDistance = 'Distance must be positive';
    }
    
    // Image validation - only for add mode
    if (!isEditMode && selectedImages.length === 0) {
      errors.images = 'At least one image is required';
    }
    
    return errors;
  };

  const preparePropertyData = () => {
    const propertyDataToSend = {
      propertyAddress: {
        streetAddress: propertyData.streetAddress,
        city: propertyData.city,
        state: propertyData.state,
        zipCode: propertyData.zipCode,
        country: propertyData.country
      },
      price: {
        amount: parseFloat(propertyData.amount),
        currency: propertyData.currency,
        priceType: propertyData.priceType,
        pricePerSquareUnit: propertyData.pricePerSquareUnit ? 
          parseFloat(propertyData.pricePerSquareUnit) : null
      },
      dimensions: {
        plotArea: propertyData.plotArea ? {
          value: parseFloat(propertyData.plotArea),
          unit: 'sqft'
        } : undefined,
        builtUpArea: propertyData.builtUpArea ? {
          value: parseFloat(propertyData.builtUpArea),
          unit: 'sqft'
        } : undefined
      },
      distanceFromTransport: {
        railwayStation: propertyData.nearestStationName || propertyData.railwayDistance ? {
          distance: propertyData.railwayDistance ? parseFloat(propertyData.railwayDistance) : null,
          unit: 'km',
          nearestStationName: propertyData.nearestStationName || null
        } : undefined,
        busStand: propertyData.nearestBusStandName || propertyData.busDistance ? {
          distance: propertyData.busDistance ? parseFloat(propertyData.busDistance) : null,
          unit: 'km',
          nearestBusStandName: propertyData.nearestBusStandName || null
        } : undefined
      },
      lastUpdatedBy: user._id
    };

    // Remove undefined fields
    Object.keys(propertyDataToSend).forEach(key => {
      if (propertyDataToSend[key] === undefined) {
        delete propertyDataToSend[key];
      }
    });

    // For edit mode, include removed images
    if (isEditMode) {
      propertyDataToSend.removedImages = removedImages.map(img => img._id);
    }

    return propertyDataToSend;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    dispatch(clearPropertyError());
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Prepare data for API
    const propertyDataToSend = preparePropertyData();
    
    let result;
    if (isEditMode) {
      // Dispatch update property action
      result = await dispatch(updateProperty(id, propertyDataToSend, selectedImages));
    } else {
      // For new property, add createdBy field
      propertyDataToSend.createdBy = user._id;
      // Dispatch create property action
      result = await dispatch(createProperty(propertyDataToSend, selectedImages));
    }
    
    if (result?.success) {
      // Success is handled in useEffect
    }
  };

  const handleCancel = () => {
    dispatch(clearPropertyError());
    navigate('/admin/properties');
  };

  if (isEditMode && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditMode ? 'Edit Property' : 'Add New Property'}
          </h1>
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg">
              {isEditMode ? 'Property updated successfully!' : 'Property created successfully!'}
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Address Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Property Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                  {formErrors.streetAddress && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.streetAddress}</span>
                  )}
                </label>
                <input 
                  type="text" 
                  name="streetAddress"
                  value={propertyData.streetAddress}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.streetAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                  {formErrors.city && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.city}</span>
                  )}
                </label>
                <input 
                  type="text" 
                  name="city"
                  value={propertyData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                  {formErrors.state && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.state}</span>
                  )}
                </label>
                <input 
                  type="text" 
                  name="state"
                  value={propertyData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code *
                  {formErrors.zipCode && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.zipCode}</span>
                  )}
                </label>
                <input 
                  type="text" 
                  name="zipCode"
                  value={propertyData.zipCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input 
                  type="text" 
                  name="country"
                  value={propertyData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* Price Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Pricing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                  {formErrors.amount && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.amount}</span>
                  )}
                </label>
                <div className="relative">
                  <select 
                    name="currency"
                    value={propertyData.currency}
                    onChange={handleChange}
                    className="absolute left-0 top-0 h-full px-3 border-r border-gray-300 rounded-l-lg bg-gray-100"
                  >
                    <option value="INR">₹</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                    <option value="GBP">£</option>
                  </select>
                  <input 
                    type="number" 
                    name="amount"
                    value={propertyData.amount}
                    onChange={handleChange}
                    className={`w-full pl-16 pr-4 py-2 border ${formErrors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                <select 
                  name="priceType"
                  value={propertyData.priceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Square Unit</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="pricePerSquareUnit"
                    value={propertyData.pricePerSquareUnit}
                    onChange={handleChange}
                    className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute left-0 top-0 h-full px-3 flex items-center text-gray-500">₹/sqft</div>
                </div>
              </div>
            </div>
          </section>

          {/* Property Dimensions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Property Dimensions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plot Area (sqft)
                  {formErrors.plotArea && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.plotArea}</span>
                  )}
                </label>
                <input 
                  type="number" 
                  name="plotArea"
                  value={propertyData.plotArea}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.plotArea ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Built-up Area (sqft)
                  {formErrors.builtUpArea && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.builtUpArea}</span>
                  )}
                </label>
                <input 
                  type="number" 
                  name="builtUpArea"
                  value={propertyData.builtUpArea}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.builtUpArea ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </section>

          {/* Transport Accessibility */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Transport Accessibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Railway Station</label>
                <input 
                  type="text" 
                  name="nearestStationName"
                  value={propertyData.nearestStationName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance from Station (km)
                  {formErrors.railwayDistance && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.railwayDistance}</span>
                  )}
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  name="railwayDistance"
                  value={propertyData.railwayDistance}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.railwayDistance ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Bus Stand</label>
                <input 
                  type="text" 
                  name="nearestBusStandName"
                  value={propertyData.nearestBusStandName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance from Bus Stand (km)
                  {formErrors.busDistance && (
                    <span className="text-red-500 text-sm ml-2">{formErrors.busDistance}</span>
                  )}
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  name="busDistance"
                  value={propertyData.busDistance}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.busDistance ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  min="0"
                />
              </div>
            </div>
          </section>

          {/* Property Images */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Property Images</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images {!isEditMode && '*'}
                {formErrors.images && (
                  <span className="text-red-500 text-sm ml-2">{formErrors.images}</span>
                )}
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="property-images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB each)</p>
                  </div>
                  <input 
                    id="property-images" 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              {/* Existing Images (Edit mode only) */}
              {isEditMode && existingImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h3>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((image, index) => (
                      <div key={image._id || index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.caption || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image._id, image.url)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Removed Images (Edit mode only) */}
              {isEditMode && removedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Removed Images</h3>
                  <div className="flex flex-wrap gap-2">
                    {removedImages.map((image, index) => (
                      <div key={image._id || index} className="relative w-24 h-24 border border-red-300 rounded-lg overflow-hidden opacity-50">
                        <img 
                          src={image.url} 
                          alt={`Removed ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => restoreExistingImage(image._id)}
                          className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-600"
                        >
                          ↺
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New Images */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Images ({selectedImages.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Submit Section */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
              disabled={isEditMode && loading}
            >
              {isEditMode && loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {isEditMode ? 'Update Property' : 'Save Property'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PropertyForm;