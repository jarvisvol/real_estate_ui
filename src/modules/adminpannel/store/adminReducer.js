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
  ADD_USER_SUCCESS,
  ADD_USER_REQUEST,
  ADD_USER_FAILURE,
  FETCH_USER_DETAILS_REQUEST,
  FETCH_USER_DETAILS_FAILURE,
  FETCH_USER_DETAILS_SUCCESS,
  RESET_USER_STATE,
  CLEAR_USER_ERROR
} from './adminActionTypes';

const initialState = {
  // Property Management State
  properties: [],
  property: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: false,
  
  // User Management State
  users: [],
  usersLoading: false,
  usersError: null,
  userUpdating: false,
  userDeleting: false
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {

    case ADD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
      
    case ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload],
        success: true,
        error: null
      };
      
    case ADD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };

    case FETCH_USER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case FETCH_USER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        userDetails: action.payload.data || action.payload,
        error: null
      };
      
    case FETCH_USER_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        userDetails: null,
        error: action.payload
      };
    
    case FETCH_PROPERTIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case FETCH_PROPERTIES_SUCCESS:
      return {
        ...state,
        loading: false,
        properties: action.payload.data.data,
        error: null
      };
      
    case FETCH_PROPERTIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case FETCH_PROPERTY_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case FETCH_PROPERTY_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        property: action.payload,
        error: null
      };
      
    case FETCH_PROPERTY_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case CREATE_PROPERTY_REQUEST:
      return {
        ...state,
        creating: true,
        error: null,
        success: false
      };
      
    case CREATE_PROPERTY_SUCCESS:
      return {
        ...state,
        creating: false,
        properties: [...state.properties, action.payload],
        success: true,
        error: null
      };
      
    case CREATE_PROPERTY_FAILURE:
      return {
        ...state,
        creating: false,
        error: action.payload,
        success: false
      };
      
    case UPDATE_PROPERTY_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
        success: false
      };
      
    case UPDATE_PROPERTY_SUCCESS:
      return {
        ...state,
        updating: false,
        properties: state.properties.map(property => 
          property._id === action.payload._id ? action.payload : property
        ),
        property: action.payload,
        success: true,
        error: null
      };
      
    case UPDATE_PROPERTY_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
        success: false
      };
      
    case DELETE_PROPERTY_REQUEST:
      return {
        ...state,
        deleting: true,
        error: null
      };
      
    case DELETE_PROPERTY_SUCCESS:
      return {
        ...state,
        deleting: false,
        properties: state.properties.filter(property => property._id !== action.payload),
        error: null
      };
      
    case DELETE_PROPERTY_FAILURE:
      return {
        ...state,
        deleting: false,
        error: action.payload
      };
      
    case RESET_PROPERTY_STATE:
      return {
        ...state,
        property: null,
        error: null,
        success: false
      };
      
    case CLEAR_PROPERTY_ERROR:
      return {
        ...state,
        error: null
      };
      
    // =============== USER MANAGEMENT REDUCERS ===============
    
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        usersLoading: true,
        usersError: null
      };
      
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        users: action.payload.data.users,
        usersError: null
      };
      
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        usersLoading: false,
        usersError: action.payload
      };
      
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
      
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map(user => 
          user._id === action.payload._id ? action.payload : user
        ),
        error: null,
        success: true
      };
      
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
    case DELETE_USER_REQUEST:
      return {
        ...state,
        userDeleting: true,
        usersError: null
      };
      
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        userDeleting: false,
        users: state.users.filter(user => user._id !== action.payload),
        usersError: null
      };
      
    case DELETE_USER_FAILURE:
      return {
        ...state,
        userDeleting: false,
        usersError: action.payload
      };

    case CLEAR_USER_ERROR:
      return {
        ...state,
        error: null,
        detailsError: null,
        usersError: null,
        success: false,
        deleteSuccess: false
      };
      
    case RESET_USER_STATE:
      return {
        ...initialState,
        // Keep users list if needed
        users: state.users,
        totalUsers: state.totalUsers,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        limit: state.limit
      };
      
    default:
      return state;
  }
};

export default adminReducer;