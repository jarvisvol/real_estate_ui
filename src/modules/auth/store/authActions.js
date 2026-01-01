import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  LOGOUT,
  CLEAR_ERROR
} from './actionTypes';
import { authApi } from '../../../Utils/Http/Http';

// Login action
export const loginUser = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    
    try {
      const response = await authApi.post('/user/login', { 
        email, 
        password 
      });

      const { data } = response;
      
      // Check API response format
      if (data.status === 'success' && data.data) {
        const { access_token, user } = data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', access_token);
        
        dispatch({ 
          type: LOGIN_SUCCESS, 
          payload: { 
            token: access_token, 
            user 
          } 
        });
      } else {
        // Handle API error response
        dispatch({ 
          type: LOGIN_FAILURE, 
          payload: data.message || 'Login failed' 
        });
      }
    } catch (error) {
      let errorMessage = 'Network error. Please try again.';
      
      if (error.response?.data) {
        // Your API returns error in this format:
        // { status: 'error', message: 'Error message' }
        errorMessage = error.response.data.message || 'Login failed';
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      dispatch({ 
        type: LOGIN_FAILURE, 
        payload: errorMessage 
      });
    }
  };
};

// Register action
export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  
  try {
    const response = await authApi.post('/user/register', userData);
    const { data } = response;

    if (data.status === 'success' && data.data) {
      const { access_token, user } = data.data;
      
      // Store token if your API returns it
      if (access_token) {
        localStorage.setItem('token', access_token);
      }
      
      dispatch({ 
        type: REGISTER_SUCCESS, 
        payload: { 
          token: access_token,
          user 
        } 
      });
    } else {
      dispatch({ 
        type: REGISTER_FAILURE, 
        payload: data.message || 'Registration failed' 
      });
    }
  } catch (error) {
    let errorMessage = 'Network error. Please try again.';
    
    if (error.response?.data) {
      errorMessage = error.response.data.message || 'Registration failed';
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    dispatch({ 
      type: REGISTER_FAILURE, 
      payload: errorMessage 
    });
  }
};

// Verify token action - using user profile endpoint
export const verifyToken = () => {
  return async (dispatch) => {
    dispatch({ type: VERIFY_TOKEN_REQUEST });
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: VERIFY_TOKEN_FAILURE });
      return;
    }

    try {
      // Since your API doesn't have /auth/verify endpoint,
      // we'll verify by fetching user profile
      const response = await authApi.get('/user/profile');
      const { data } = response;
      
      if (data.status === 'success' && data.data) {
        const userData = data.data;
        dispatch({ 
          type: VERIFY_TOKEN_SUCCESS, 
          payload: { 
            token, 
            user: userData 
          } 
        });
      } else {
        localStorage.removeItem('token');
        dispatch({ type: VERIFY_TOKEN_FAILURE });
      }
    } catch (error) {
      // If endpoint doesn't exist or returns error
      localStorage.removeItem('token');
      dispatch({ type: VERIFY_TOKEN_FAILURE });
    }
  };
};

// Alternative: Get user by token endpoint if available
export const verifyTokenByGetUser = () => {
  return async (dispatch) => {
    dispatch({ type: VERIFY_TOKEN_REQUEST });
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: VERIFY_TOKEN_FAILURE });
      return;
    }

    try {
      // If your backend has a "get user by token" endpoint
      const response = await authApi.get('/user/me');
      const { data } = response;
      
      if (data.status === 'success' && data.data) {
        const userData = data.data;
        dispatch({ 
          type: VERIFY_TOKEN_SUCCESS, 
          payload: { 
            token, 
            user: userData 
          } 
        });
      } else {
        localStorage.removeItem('token');
        dispatch({ type: VERIFY_TOKEN_FAILURE });
      }
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: VERIFY_TOKEN_FAILURE });
    }
  };
};

// Logout action
export const logoutUser = () => {
  localStorage.removeItem('token');
  return { type: LOGOUT };
};

// Clear error action
export const clearError = () => {
  return { type: CLEAR_ERROR };
};

// Optional: Action to update user state if needed elsewhere
export const updateUserInState = (userData) => {
  return (dispatch, getState) => {
    const { auth } = getState();
    if (auth.user && auth.user.id === userData.id) {
      // You can dispatch a custom action if needed
      // For now, we'll just return the user data for local updates
      return userData;
    }
  };
};