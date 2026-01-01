import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, updateUser, fetchUserDetails, clearUserError, resetUserState } from '../store/adminActions';

const UserForm = ({ isEditMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL for edit mode

  // Get state from Redux store
  const { error, success, loading, userDetails } = useSelector((state) => state.admin);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    landType: 'agricultural',
    password: '',
    confirmPassword: '',
    role: 'user',
    isActive: true,
    isVerified: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch user details for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchUserDetails(id));
    }
  }, [isEditMode, id, dispatch]);

  // Populate form data when userDetails is loaded
  useEffect(() => {
    if (isEditMode && userDetails && userDetails._id === id) {
      // Format data from API to match form state
      const formattedData = {
        name: userDetails.name || '',
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
        street: userDetails.address?.street || '',
        city: userDetails.address?.city || '',
        state: userDetails.address?.state || '',
        country: userDetails.address?.country || 'India',
        pincode: userDetails.address?.pincode || '',
        landType: userDetails.landType || 'agricultural',
        password: '', // Leave empty for edit
        confirmPassword: '', // Leave empty for edit
        role: userDetails.role || 'user',
        isActive: userDetails.isActive ?? true,
        isVerified: userDetails.isVerified ?? false
      };
      
      setUserData(formattedData);
    }
  }, [userDetails, isEditMode, id]);

  // Handle success state
  useEffect(() => {
    if (success) {
      // const message = isEditMode ? 'User updated successfully!' : 'User created successfully!';
      // alert(message);
      
      // Reset form for add mode only
      if (!isEditMode) {
        setUserData({
          name: '',
          email: '',
          phoneNumber: '',
          street: '',
          city: '',
          state: '',
          country: 'India',
          pincode: '',
          landType: 'agricultural',
          password: '',
          confirmPassword: '',
          role: 'user',
          isActive: true,
          isVerified: false
        });
        setFormErrors({});
        setShowPassword(false);
      }
      
      dispatch(resetUserState());
      
      // Navigate back to users list
      navigate('/admin/users');
    }
  }, [success, dispatch, navigate, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!userData.name.trim()) {
      errors.name = 'Name is required';
    } else if (userData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!userData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!userData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(userData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid 10-digit Indian phone number';
    }

    if (!userData.city.trim()) {
      errors.city = 'City is required';
    }

    // Password validation (only required for add mode or when changing password)
    if (!isEditMode && !userData.password) {
      errors.password = 'Password is required';
    } else if (!isEditMode && userData.password && userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // For edit mode, only validate password if provided
    if (isEditMode && userData.password && userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!isEditMode && !userData.confirmPassword) {
      errors.confirmPassword = 'Please confirm password';
    } else if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (userData.pincode && !/^\d{6}$/.test(userData.pincode)) {
      errors.pincode = 'PIN code must be 6 digits';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    dispatch(clearUserError());
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Prepare data for API
    const userDataToSend = {
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phoneNumber: userData.phoneNumber.trim(),
      address: {
        street: userData.street.trim(),
        city: userData.city.trim(),
        state: userData.state.trim(),
        country: userData.country.trim(),
        pincode: userData.pincode.trim()
      },
      landType: userData.landType,
      role: userData.role,
      isActive: userData.isActive,
      isVerified: userData.isVerified
    };

    // Only include password if provided (for edit mode) or always for add mode
    if ((isEditMode && userData.password) || !isEditMode) {
      userDataToSend.password = userData.password;
    }

    let result;
    if (isEditMode) {
      // Dispatch update user action
      result = await dispatch(updateUser(id, userDataToSend));
    } else {
      // Dispatch add user action
      result = await dispatch(addUser(userDataToSend));
    }
    
    if (result?.success) {
      // Success is handled in useEffect
    }
  };

  const handleCancel = () => {
    dispatch(clearUserError());
    navigate('/admin/users');
  };

  const landTypeOptions = [
    { value: 'agricultural', label: 'Agricultural' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'forest', label: 'Forest' },
    { value: 'barren', label: 'Barren' },
    { value: 'pasture', label: 'Pasture' },
    { value: 'other', label: 'Other' }
  ];

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'agent', label: 'Agent' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit User' : 'Add New User'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update user information' : 'Create a new user account in the system'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </button>
        </div>

        {/* Loading state for edit mode */}
        {isEditMode && loading && !userDetails && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Personal Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                    {formErrors.name && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.name}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                    {formErrors.email && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.email}</span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="user@example.com"
                    readOnly={isEditMode} // Email should not be editable
                  />
                  {isEditMode && (
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                    {formErrors.phoneNumber && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.phoneNumber}</span>
                    )}
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="9876543210"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Role
                  </label>
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Address Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Address Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={userData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                    {formErrors.city && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.city}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={userData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={userData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                    {formErrors.pincode && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.pincode}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={userData.pincode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="123456"
                    maxLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Type
                  </label>
                  <select
                    name="landType"
                    value={userData.landType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {landTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Security & Status */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                {isEditMode ? 'Change Password & Status' : 'Security & Status'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditMode ? 'New Password (Optional)' : 'Password *'}
                    {formErrors.password && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.password}</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-12`}
                      placeholder={isEditMode ? "Leave blank to keep current" : "Enter password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? 'Leave blank to keep current password' : 'Minimum 6 characters'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditMode ? 'Confirm Password' : 'Confirm Password *'}
                    {formErrors.confirmPassword && (
                      <span className="text-red-500 text-sm ml-2">{formErrors.confirmPassword}</span>
                    )}
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder={isEditMode ? "Confirm new password" : "Confirm password"}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={userData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Account Active
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isVerified"
                      name="isVerified"
                      checked={userData.isVerified}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isVerified" className="ml-2 text-sm text-gray-700">
                      Email Verified
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Fields marked with * are required
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium min-w-[120px]"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 min-w-[120px]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isEditMode ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        )}
                      </svg>
                      {isEditMode ? 'Update User' : 'Create User'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UserForm;