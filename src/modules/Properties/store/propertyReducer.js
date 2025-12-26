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
  CLIENT_CONTACT_RESET,
} from './actionTypes';

const initialState = {
  // Status tracking
  status: 'IDLE', // Initial status

  // Properties list
  properties: [],
  propertyDetails: null,
  savedProperties: [],

  // Pagination
  totalProperties: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10,

  // Filters and sorting
  filters: {
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    priceType: 'sale',
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
        status: action.type,
        loading: true,
        error: null
      };

    case FETCH_USER_PROPERTIES_SUCCESS:
      const responseData = action.payload?.data?.data || [];
      const paginationData = action.payload?.data || {};

      return {
        ...state,
        status: action.type,
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
        status: action.type,
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
        status: action.type,
        detailsLoading: true,
        detailsError: null,
        propertyDetails: null
      };

    case FETCH_USER_PROPERTY_DETAILS_SUCCESS:
      const detailsData = action.payload?.data || action.payload;
      return {
        ...state,
        status: action.type,
        detailsLoading: false,
        propertyDetails: detailsData,
        detailsError: null
      };

    case FETCH_USER_PROPERTY_DETAILS_FAILURE:
      return {
        ...state,
        status: action.type,
        detailsLoading: false,
        propertyDetails: null,
        detailsError: action.payload
      };

    // Filter and sort
    case FILTER_USER_PROPERTIES:
      return {
        ...state,
        status: action.type,
        filters: { ...state.filters, ...action.payload },
        currentPage: 1
      };

    case SORT_USER_PROPERTIES:
      return {
        ...state,
        status: action.type,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        currentPage: 1
      };

    // Save property
    case SAVE_PROPERTY_REQUEST:
      return {
        ...state,
        status: action.type,
        saving: true,
        saveError: null,
        saveSuccess: false
      };

    case SAVE_PROPERTY_SUCCESS:
      const updatedProperties = state.properties.map(property =>
        property._id === action.payload.propertyId
          ? { ...property, isSaved: true }
          : property
      );

      const updatedPropertyDetails = state.propertyDetails &&
        state.propertyDetails._id === action.payload.propertyId
        ? { ...state.propertyDetails, isSaved: true }
        : state.propertyDetails;

      const savedProperty = state.properties.find(p => p._id === action.payload.propertyId);
      const updatedSavedProperties = savedProperty && !state.savedProperties.find(p => p._id === action.payload.propertyId)
        ? [savedProperty, ...state.savedProperties]
        : state.savedProperties;

      return {
        ...state,
        status: action.type,
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
        status: action.type,
        saving: false,
        saveError: action.payload,
        saveSuccess: false
      };

    // Unsave property
    case UNSAVE_PROPERTY_REQUEST:
      return {
        ...state,
        status: action.type,
        unsaving: true,
        saveError: null,
        unsaveSuccess: false
      };

    case UNSAVE_PROPERTY_SUCCESS:
      const unsavedProperties = state.properties.map(property =>
        property._id === action.payload.propertyId
          ? { ...property, isSaved: false }
          : property
      );

      const unsavedPropertyDetails = state.propertyDetails &&
        state.propertyDetails._id === action.payload.propertyId
        ? { ...state.propertyDetails, isSaved: false }
        : state.propertyDetails;

      const filteredSavedProperties = state.savedProperties.filter(
        property => property._id !== action.payload.propertyId
      );

      return {
        ...state,
        status: action.type,
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
        status: action.type,
        unsaving: false,
        saveError: action.payload,
        unsaveSuccess: false
      };

    // Saved properties
    case FETCH_SAVED_PROPERTIES_REQUEST:
      return {
        ...state,
        status: action.type,
        savedLoading: true,
        savedError: null
      };

    case FETCH_SAVED_PROPERTIES_SUCCESS:
      const savedResponseData = action.payload?.data?.data || [];
      return {
        ...state,
        status: action.type,
        savedLoading: false,
        savedProperties: savedResponseData,
        savedError: null
      };

    case FETCH_SAVED_PROPERTIES_FAILURE:
      return {
        ...state,
        status: action.type,
        savedLoading: false,
        savedProperties: [],
        savedError: action.payload
      };

    // Clear errors and reset
    case CLEAR_USER_PROPERTY_ERROR:
      return {
        ...state,
        status: action.type,
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
        status: action.type,
        filters: state.filters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder
      };

    case CLIENT_CONTACT_REQUEST:
      return {
        ...state,
        status: action.type,
        loading: true,
        success: false,
        error: null,
      };

    case CLIENT_CONTACT_SUCCESS:      
      return {
        ...state,
        status: action.type,
        loading: false,
        success: true,
        contactData: action.payload.data.data,
        error: null,
      };

    case CLIENT_CONTACT_FAILURE:
      return {
        ...state,
        status: action.type,
        loading: false,
        success: false,
        error: action.payload,
        contactData: null,
      };

    case CLIENT_CONTACT_RESET:
      return {
        ...initialState,
        status: action.type
      };

    default:
      return state;
  }
};

export default propertyReducer;