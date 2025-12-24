import { authApi } from '../../../Utils/Http/Http';
import {
  // Property Actions
  FETCH_PROPERTIES_REQUEST,
  FETCH_PROPERTIES_SUCCESS,
  FETCH_PROPERTIES_FAILURE,
  FETCH_PROPERTY_DETAILS_REQUEST,
  FETCH_PROPERTY_DETAILS_SUCCESS,
  FETCH_PROPERTY_DETAILS_FAILURE,
  CREATE_PROPERTY_REQUEST,
  CREATE_PROPERTY_SUCCESS,
  CREATE_PROPERTY_FAILURE,
  UPDATE_PROPERTY_REQUEST,
  UPDATE_PROPERTY_SUCCESS,
  UPDATE_PROPERTY_FAILURE,
  DELETE_PROPERTY_REQUEST,
  DELETE_PROPERTY_SUCCESS,
  DELETE_PROPERTY_FAILURE,
  RESET_PROPERTY_STATE,
  CLEAR_PROPERTY_ERROR,

  // User Actions
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  FETCH_USER_DETAILS_REQUEST,
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAILURE,
  CLEAR_USER_ERROR,
  RESET_USER_STATE,
  ADD_USER_REQUEST,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE
} from './adminActionTypes';


export const addUser = (userData) => async (dispatch) => {
  dispatch({ type: ADD_USER_REQUEST });
  try {
    // Make API call to add user
    const response = await authApi.post('/admin/users', userData);

    dispatch({
      type: ADD_USER_SUCCESS,
      payload: response.data
    });

    return {
      success: true,
      data: response.data,
      message: 'User created successfully'
    };

  } catch (error) {
    const errorMessage = error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to create user';

    dispatch({
      type: ADD_USER_FAILURE,
      payload: errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
};

export const fetchUserDetails = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_USER_DETAILS_REQUEST });
  try {
    const response = await authApi.get(`/admin/users/${userId}`);
    dispatch({
      type: FETCH_USER_DETAILS_SUCCESS,
      payload: response.data
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({
      type: FETCH_USER_DETAILS_FAILURE,
      payload: error.response?.data?.message || error.message
    });
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// Fetch all properties
export const fetchProperties = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PROPERTIES_REQUEST });

    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await authApi.get(`/admin/properties?${params}`);

      dispatch({
        type: FETCH_PROPERTIES_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: FETCH_PROPERTIES_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch properties'
      });
    }
  };
};

// Fetch single property details
export const fetchPropertyDetails = (propertyId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PROPERTY_DETAILS_REQUEST });

    try {
      const response = await authApi.get(`/admin/properties/${propertyId}`, {

      });

      dispatch({
        type: FETCH_PROPERTY_DETAILS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: FETCH_PROPERTY_DETAILS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch property details'
      });
    }
  };
};

// Create new property
export const createProperty = (propertyData, images) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_PROPERTY_REQUEST });

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add property data as JSON string
      formData.append('property', JSON.stringify(propertyData));

      // Add images
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await authApi.post(`/admin/properties`, formData, {

      });

      dispatch({
        type: CREATE_PROPERTY_SUCCESS,
        payload: response.data
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create property';
      dispatch({
        type: CREATE_PROPERTY_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Update property
export const updateProperty = (propertyId, propertyData, images = []) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PROPERTY_REQUEST });

    try {
      const formData = new FormData();
      formData.append('property', JSON.stringify(propertyData));

      // Add new images if any
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      const response = await authApi.put(`/admin/properties/${propertyId}`, formData, {

      });

      dispatch({
        type: UPDATE_PROPERTY_SUCCESS,
        payload: response.data
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update property';
      dispatch({
        type: UPDATE_PROPERTY_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Delete property
export const deleteProperty = (propertyId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_PROPERTY_REQUEST });

    try {
      await authApi.delete(`/admin/properties/${propertyId}`, {

      });

      dispatch({
        type: DELETE_PROPERTY_SUCCESS,
        payload: propertyId
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete property';
      dispatch({
        type: DELETE_PROPERTY_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Reset property state
export const resetPropertyState = () => ({
  type: RESET_PROPERTY_STATE
});

// Clear property error
export const clearPropertyError = () => ({
  type: CLEAR_PROPERTY_ERROR
});

// =============== USER MANAGEMENT ACTIONS ===============

// Fetch all users
export const fetchUsers = (filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_USERS_REQUEST });

    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await authApi.get(`/admin/users?${params}`, {

      });

      dispatch({
        type: FETCH_USERS_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: FETCH_USERS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch users'
      });
    }
  };
};

// Update user
export const updateUser = (userId, userData) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_USER_REQUEST });

    try {
      const response = await authApi.put(`/admin/users/${userId}`, userData, {

      });

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: response.data
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      dispatch({
        type: UPDATE_USER_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Delete user
export const deleteUser = (userId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_USER_REQUEST });

    try {
      await authApi.delete(`/admin/users/${userId}`, {

      });

      dispatch({
        type: DELETE_USER_SUCCESS,
        payload: userId
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      dispatch({
        type: DELETE_USER_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

export const clearUserError = () => ({
  type: CLEAR_USER_ERROR
});

/**
 * Reset user state
 */
export const resetUserState = () => ({
  type: RESET_USER_STATE
});