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
  RESET_USER_PROPERTY_STATE
} from './actionTypes';

const initialState = {
  // Properties list
  properties: [],
  propertyDetails: null,
  savedProperties: [],
  
  // Pagination
  totalProperties: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 12,
  
  // Filters and sorting
  filters: {
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    priceType: 'sale', // sale/rent
    bedrooms: '',
    bathrooms: ''
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  
  // Loading states
  loading: false,
  detailsLoading: false,
  saving: false,
  unsaving: false,
  savedLoading: false,
  
  // Error states
  error: null,
  detailsError: null,
  saveError: null,
  savedError: null,
  
  // Success states
  saveSuccess: false,
  unsaveSuccess: false
};

const propertyReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch properties
    case FETCH_USER_PROPERTIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case FETCH_USER_PROPERTIES_SUCCESS:
      return {
        ...state,
        loading: false,
        properties: action.payload.data?.data || [],
        totalProperties: action.payload.data?.total || 0,
        totalPages: action.payload.data?.totalPages || 1,
        currentPage: action.payload.data?.currentPage || 1,
        limit: action.payload.data?.limit || 12,
        error: null
      };
      
    case FETCH_USER_PROPERTIES_FAILURE:
      return {
        ...state,
        loading: false,
        properties: [],
        error: action.payload
      };
      
    // Property details
    case FETCH_USER_PROPERTY_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null
      };
      
    case FETCH_USER_PROPERTY_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        propertyDetails: action.payload.data || action.payload,
        detailsError: null
      };
      
    case FETCH_USER_PROPERTY_DETAILS_FAILURE:
      return {
        ...state,
        detailsLoading: false,
        detailsError: action.payload
      };
      
    // Filter and sort
    case FILTER_USER_PROPERTIES:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        currentPage: 1 // Reset to first page when filtering
      };
      
    case SORT_USER_PROPERTIES:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        currentPage: 1 // Reset to first page when sorting
      };
      
    // Save property
    case SAVE_PROPERTY_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null,
        saveSuccess: false
      };
      
    case SAVE_PROPERTY_SUCCESS:
      // Mark property as saved in properties list
      const updatedProperties = state.properties.map(property => 
        property._id === action.payload.propertyId 
          ? { ...property, isSaved: true }
          : property
      );
      
      // Add to saved properties if not already there
      const savedProperty = state.properties.find(p => p._id === action.payload.propertyId);
      const updatedSavedProperties = savedProperty && !state.savedProperties.find(p => p._id === action.payload.propertyId)
        ? [savedProperty, ...state.savedProperties]
        : state.savedProperties;
      
      return {
        ...state,
        saving: false,
        properties: updatedProperties,
        savedProperties: updatedSavedProperties,
        saveSuccess: true,
        saveError: null
      };
      
    case SAVE_PROPERTY_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: action.payload,
        saveSuccess: false
      };
      
    // Unsave property
    case UNSAVE_PROPERTY_REQUEST:
      return {
        ...state,
        unsaving: true,
        saveError: null,
        unsaveSuccess: false
      };
      
    case UNSAVE_PROPERTY_SUCCESS:
      // Mark property as unsaved in properties list
      const unsavedProperties = state.properties.map(property => 
        property._id === action.payload.propertyId 
          ? { ...property, isSaved: false }
          : property
      );
      
      // Remove from saved properties
      const filteredSavedProperties = state.savedProperties.filter(
        property => property._id !== action.payload.propertyId
      );
      
      return {
        ...state,
        unsaving: false,
        properties: unsavedProperties,
        savedProperties: filteredSavedProperties,
        unsaveSuccess: true,
        saveError: null
      };
      
    case UNSAVE_PROPERTY_FAILURE:
      return {
        ...state,
        unsaving: false,
        saveError: action.payload,
        unsaveSuccess: false
      };
      
    // Saved properties
    case FETCH_SAVED_PROPERTIES_REQUEST:
      return {
        ...state,
        savedLoading: true,
        savedError: null
      };
      
    case FETCH_SAVED_PROPERTIES_SUCCESS:
      return {
        ...state,
        savedLoading: false,
        savedProperties: action.payload.data?.data || [],
        savedError: null
      };
      
    case FETCH_SAVED_PROPERTIES_FAILURE:
      return {
        ...state,
        savedLoading: false,
        savedError: action.payload
      };
      
    // Clear errors and reset
    case CLEAR_USER_PROPERTY_ERROR:
      return {
        ...state,
        error: null,
        detailsError: null,
        saveError: null,
        savedError: null,
        saveSuccess: false,
        unsaveSuccess: false
      };
      
    case RESET_USER_PROPERTY_STATE:
      return {
        ...initialState,
        filters: state.filters, // Keep filters
        sortBy: state.sortBy, // Keep sort settings
        sortOrder: state.sortOrder
      };
      
    default:
      return state;
  }
};

export default propertyReducer;