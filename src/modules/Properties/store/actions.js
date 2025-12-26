import { authApi } from '../../../Utils/Http/Http';
import {
  FETCH_USER_PROPERTIES_REQUEST,
  FETCH_USER_PROPERTIES_SUCCESS,
  FETCH_USER_PROPERTIES_FAILURE,
  FETCH_USER_PROPERTY_DETAILS_REQUEST,
  FETCH_USER_PROPERTY_DETAILS_SUCCESS,
  FETCH_USER_PROPERTY_DETAILS_FAILURE,
  FILTER_USER_PROPERTIES,
  SORT_USER_PROPERTIES,
  SAVE_PROPERTY_REQUEST,
  SAVE_PROPERTY_SUCCESS,
  SAVE_PROPERTY_FAILURE,
  UNSAVE_PROPERTY_REQUEST,
  UNSAVE_PROPERTY_SUCCESS,
  UNSAVE_PROPERTY_FAILURE,
  FETCH_SAVED_PROPERTIES_REQUEST,
  FETCH_SAVED_PROPERTIES_SUCCESS,
  FETCH_SAVED_PROPERTIES_FAILURE,
  CLEAR_USER_PROPERTY_ERROR,
  RESET_USER_PROPERTY_STATE,
  CLIENT_CONTACT_REQUEST,
  CLIENT_CONTACT_SUCCESS,
  CLIENT_CONTACT_FAILURE,
  CLIENT_CONTACT_RESET
} from './actionTypes';

// Fetch all properties for users (public access)
export const fetchUserProperties = (filters = {}, page = 1, limit = 10) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_USER_PROPERTIES_REQUEST });
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await authApi.get(`/properties?${params}`, {
      });
      
      dispatch({
        type: FETCH_USER_PROPERTIES_SUCCESS,
        payload: response.data
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch properties';
      dispatch({
        type: FETCH_USER_PROPERTIES_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Fetch single property details for users
export const fetchUserPropertyDetails = (propertyId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_USER_PROPERTY_DETAILS_REQUEST });
    
    try {
      const response = await authApi.get(`/properties/${propertyId}`, {
      });
      
      dispatch({
        type: FETCH_USER_PROPERTY_DETAILS_SUCCESS,
        payload: response.data
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch property details';
      dispatch({
        type: FETCH_USER_PROPERTY_DETAILS_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Filter properties (client-side filtering)
export const filterUserProperties = (filters) => {
  return {
    type: FILTER_USER_PROPERTIES,
    payload: filters
  };
};

// Sort properties (client-side sorting)
export const sortUserProperties = (sortBy, sortOrder = 'asc') => {
  return {
    type: SORT_USER_PROPERTIES,
    payload: { sortBy, sortOrder }
  };
};

// Save property to favorites
export const saveProperty = (propertyId) => {
  return async (dispatch) => {
    dispatch({ type: SAVE_PROPERTY_REQUEST });
    
    try {
      const response = await authApi.post(
        `/user/properties/save/${propertyId}`,
        {}
      );
      
      dispatch({
        type: SAVE_PROPERTY_SUCCESS,
        payload: { propertyId, ...response.data }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save property';
      dispatch({
        type: SAVE_PROPERTY_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Unsave property from favorites
export const unsaveProperty = (propertyId) => {
  return async (dispatch) => {
    dispatch({ type: UNSAVE_PROPERTY_REQUEST });
    
    try {
      const response = await authApi.delete(
        `/user/properties/unsave/${propertyId}`,
      );
      
      dispatch({
        type: UNSAVE_PROPERTY_SUCCESS,
        payload: { propertyId, ...response.data }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to unsave property';
      dispatch({
        type: UNSAVE_PROPERTY_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Fetch saved properties
export const fetchSavedProperties = (page = 1, limit = 12) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_SAVED_PROPERTIES_REQUEST });
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await authApi.get(`/user/properties/saved?${params}`, {
      });
      
      dispatch({
        type: FETCH_SAVED_PROPERTIES_SUCCESS,
        payload: response.data
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch saved properties';
      dispatch({
        type: FETCH_SAVED_PROPERTIES_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Toggle save/unsave property (combined action)
export const toggleSaveProperty = (propertyId, isCurrentlySaved) => {
  return async (dispatch) => {
    if (isCurrentlySaved) {
      return dispatch(unsaveProperty(propertyId));
    } else {
      return dispatch(saveProperty(propertyId));
    }
  };
};

// Clear errors
export const clearUserPropertyError = () => ({
  type: CLEAR_USER_PROPERTY_ERROR
});

// Reset state
export const resetUserPropertyState = () => ({
  type: RESET_USER_PROPERTY_STATE
});

export const resetClientContact = () => ({
  type: CLIENT_CONTACT_RESET,
});

export const submitClientContact = (contactData) => async (dispatch) => {
  dispatch({ type: CLIENT_CONTACT_REQUEST });

  try {
    const response = await authApi.post('/client-contacts', contactData);

    const data = await response.json();

    if (data.status === 'success') {
      dispatch({
        type: CLIENT_CONTACT_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: CLIENT_CONTACT_FAILURE,
        payload: data.message || 'Failed to submit contact form',
      });
    }
  } catch (error) {
    dispatch({
      type: CLIENT_CONTACT_FAILURE,
      payload: error.message || 'Network error occurred',
    });
  }
};