import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProperty, clearPropertyError, resetPropertyState } from '../store/actions/adminActions';

const AddProperty = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get state from Redux store using useSelector
  const { creating, error, success } = useSelector((state) => state.admin);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [propertyData, setPropertyData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
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
  const [formErrors, setFormErrors] = useState({});

  // Redirect if not authenticated as admin/agent
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!['admin', 'agent'].includes(user?.role)) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle success
  useEffect(() => {
    if (success) {
      // Reset form and show success message
      setPropertyData({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
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
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        dispatch(resetPropertyState());
        // Optionally navigate to properties list
        // navigate('/admin/properties');
      }, 3000);
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error
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

  const validateForm = () => {
    const errors = {};
    
    if (!propertyData.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required';
    }
    if (!propertyData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!propertyData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!propertyData.country.trim()) {
      errors.country = 'Country is required';
    }
    if (!propertyData.amount || propertyData.amount <= 0) {
      errors.amount = 'Valid price is required';
    }
    
    return errors;
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
    const propertyDataToSend = {
      ...propertyData,
      amount: parseFloat(propertyData.amount),
      pricePerSquareUnit: propertyData.pricePerSquareUnit ? parseFloat(propertyData.pricePerSquareUnit) : null,
      plotArea: propertyData.plotArea ? parseFloat(propertyData.plotArea) : null,
      builtUpArea: propertyData.builtUpArea ? parseFloat(propertyData.builtUpArea) : null,
      railwayDistance: propertyData.railwayDistance ? parseFloat(propertyData.railwayDistance) : null,
      busDistance: propertyData.busDistance ? parseFloat(propertyData.busDistance) : null,
      createdBy: user._id // Add user ID who created the property
    };
    
    // Dispatch create property action
    const result = await dispatch(createProperty(propertyDataToSend, selectedImages));
    
    if (result.success) {
      // Success is handled in useEffect above
    }
  };

  const handleCancel = () => {
    dispatch(clearPropertyError());
    navigate('/admin/properties');
  };

  // Show loading state
  if (creating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Creating property...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add New Property</h1>
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg">
              Property created successfully!
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
              
              {/* Other form fields... */}
            </div>
          </section>

          {/* Property Images Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Property Images</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
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
                    disabled={creating}
                  />
                </label>
              </div>
              
              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images ({selectedImages.length})
                  </h3>
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
                          disabled={creating}
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
              disabled={creating}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={creating}
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddProperty;