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

const initialState = {
  token: localStorage.getItem('token') || null,
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case VERIFY_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case VERIFY_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        error: null
      };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case VERIFY_TOKEN_FAILURE:
      return {
        ...state,
        loading: false,
        token: null,
        user: null,
        isAuthenticated: false,
        error: action.payload
      };

    case LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        error: null
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default authReducer;