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
  limit: 10, // Changed from 12 to match your API default
  
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
      // Handle the nested response structure
      const responseData = action.payload?.data?.data || [];
      const paginationData = action.payload?.data || {};
      
      return {
        ...state,
        loading: false,
        properties: responseData,
        totalProperties: paginationData.total || 0,
        totalPages: paginationData.totalPages || 1,
        currentPage: paginationData.currentPage || 1,
        limit: parseInt(paginationData.limit) || 10,
        error: null
      };
      
    case FETCH_USER_PROPERTIES_FAILURE:
      return {
        ...state,
        loading: false,
        properties: [],
        totalProperties: 0,
        totalPages: 1,
        currentPage: 1,
        error: action.payload
      };
      
    // Property details
    case FETCH_USER_PROPERTY_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null,
        propertyDetails: null
      };
      
    case FETCH_USER_PROPERTY_DETAILS_SUCCESS:
      // Handle different response structures
      const detailsData = action.payload?.data || action.payload;
      return {
        ...state,
        detailsLoading: false,
        propertyDetails: detailsData,
        detailsError: null
      };
      
    case FETCH_USER_PROPERTY_DETAILS_FAILURE:
      return {
        ...state,
        detailsLoading: false,
        propertyDetails: null,
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
      
      // Update property details if it's the current one being viewed
      const updatedPropertyDetails = state.propertyDetails && 
        state.propertyDetails._id === action.payload.propertyId
          ? { ...state.propertyDetails, isSaved: true }
          : state.propertyDetails;
      
      // Add to saved properties if not already there
      const savedProperty = state.properties.find(p => p._id === action.payload.propertyId);
      const updatedSavedProperties = savedProperty && !state.savedProperties.find(p => p._id === action.payload.propertyId)
        ? [savedProperty, ...state.savedProperties]
        : state.savedProperties;
      
      return {
        ...state,
        saving: false,
        properties: updatedProperties,
        propertyDetails: updatedPropertyDetails,
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
      
      // Update property details if it's the current one being viewed
      const unsavedPropertyDetails = state.propertyDetails && 
        state.propertyDetails._id === action.payload.propertyId
          ? { ...state.propertyDetails, isSaved: false }
          : state.propertyDetails;
      
      // Remove from saved properties
      const filteredSavedProperties = state.savedProperties.filter(
        property => property._id !== action.payload.propertyId
      );
      
      return {
        ...state,
        unsaving: false,
        properties: unsavedProperties,
        propertyDetails: unsavedPropertyDetails,
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
      // Handle nested response structure for saved properties too
      const savedResponseData = action.payload?.data?.data || [];
      return {
        ...state,
        savedLoading: false,
        savedProperties: savedResponseData,
        savedError: null
      };
      
    case FETCH_SAVED_PROPERTIES_FAILURE:
      return {
        ...state,
        savedLoading: false,
        savedProperties: [],
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