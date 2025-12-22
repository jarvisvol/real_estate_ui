import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  CLEAR_ERROR,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE
} from './actionTypes';

const API_URL = 'http://localhost:8000/api';
// Login action
export const loginUser = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch({ 
          type: LOGIN_FAILURE, 
          payload: errorData.message || 'Login failed' 
        });
        return;
      }

      const data = await response.json();
      
      const { access_token, user } = data.data;
      var token  = access_token;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      dispatch({ 
        type: LOGIN_SUCCESS, 
        payload: { token, user } 
      });
    } catch (error) {
      dispatch({ 
        type: LOGIN_FAILURE, 
        payload: 'Network error. Please try again.' 
      });
    }
  };
};

// Register action
export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: 'REGISTER_REQUEST' });
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: 'REGISTER_SUCCESS', payload: data });
      // Store token if your API returns it
      if (data.data.access_token) {
        localStorage.setItem('token', data.data.access_token);
      }
    } else {
      dispatch({ type: 'REGISTER_FAILURE', payload: data.message });
    }
  } catch (error) {
    dispatch({ type: 'REGISTER_FAILURE', payload: 'Network error. Please try again.' });
  }
};

// Verify token action
export const verifyToken = () => {
  return async (dispatch) => {
    dispatch({ type: VERIFY_TOKEN_REQUEST });
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: VERIFY_TOKEN_FAILURE });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        dispatch({ type: VERIFY_TOKEN_FAILURE });
        return;
      }

      const userData = await response.json();
      dispatch({ 
        type: VERIFY_TOKEN_SUCCESS, 
        payload: { token, user: userData } 
      });
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