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
  ADD_USER_FAILURE,
  UPLOAD_PROPERTY_IMAGES_REQUEST,
  UPLOAD_PROPERTY_IMAGES_SUCCESS,
  UPLOAD_PROPERTY_IMAGES_FAILURE
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
    const response = await authApi.get(`/admin/user/${userId}`);
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
      // Step 1: Create property WITHOUT sending files
      // Send the number of images to create presigned URLs for
      const propertyPayload = {
        ...propertyData,
        imageCount: images.length // Tell backend how many images to expect
      };

      const response = await authApi.post(`/admin/properties`, propertyPayload);

      const { propertyId, presignedUrls, imageUrls } = response.data.data;
      console.log("Server response:", response.data);

      // Step 2: Upload all images using presigned URLs
      if (presignedUrls && images && images.length > 0) {
        const uploadResults = [];
        const uploadedImages = [];

        // Upload each image to its corresponding presigned URL
        for (let i = 0; i < Math.min(images.length, presignedUrls.length); i++) {
          const file = images[i];
          const { url: presignedUrl, key } = presignedUrls[i];
          const { url: publicUrl } = imageUrls[i];

          try {
            console.log(`Uploading image ${i + 1}:`, {
              originalName: file.name,
              key: key,
              type: file.type,
              size: file.size
            });

            // Get file extension from original file
            const fileExtension = file.name.split('.').pop().toLowerCase();

            // Determine content type based on file extension
            let contentType = file.type;
            if (!contentType) {
              switch (fileExtension) {
                case 'jpg':
                case 'jpeg':
                  contentType = 'image/jpeg';
                  break;
                case 'png':
                  contentType = 'image/png';
                  break;
                case 'gif':
                  contentType = 'image/gif';
                  break;
                case 'webp':
                  contentType = 'image/webp';
                  break;
                default:
                  contentType = 'image/jpeg';
              }
            }

            // Upload to S3 using presigned URL
            const uploadResponse = await fetch(presignedUrl, {
              method: 'PUT',
              body: file,
              headers: {
                'Content-Type': contentType,
              },
            });

            if (!uploadResponse.ok) {
              throw new Error(`Upload failed with status: ${uploadResponse.status}`);
            }

            console.log(`Image ${i + 1} uploaded successfully`);

            // Store successful upload
            uploadResults.push({
              success: true,
              key: key,
              url: publicUrl,
              index: i
            });

            uploadedImages.push({
              key: key,
              url: publicUrl
            });

          } catch (uploadError) {
            console.error(`Failed to upload image ${i + 1}:`, uploadError);
            uploadResults.push({
              success: false,
              key: key,
              error: uploadError.message,
              index: i
            });
          }
        }

        // Step 3: Update property with uploaded image URLs
        if (uploadedImages.length > 0) {
          try {
            // Update backend with the uploaded image URLs
            await authApi.put(`/admin/properties/${propertyId}/images`, {
              images: uploadedImages
            });

            console.log("Property updated with image URLs:", uploadedImages);

          } catch (updateError) {
            console.error("Failed to update property with image URLs:", updateError);
            // Even if this fails, the property was created and images uploaded to S3
          }
        }

        // Check if all uploads succeeded
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          console.warn(`${failedUploads.length} image(s) failed to upload`);

          // You might want to notify the user which images failed
          // Return partial success
          return {
            success: true,
            partial: true,
            data: response.data,
            propertyId,
            uploadResults,
            message: `Property created but ${failedUploads.length} image(s) failed to upload`
          };
        }
      }

      dispatch({
        type: CREATE_PROPERTY_SUCCESS,
        payload: response.data
      });

      return {
        success: true,
        data: response.data,
        propertyId
      };
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

// Optional: Separate action for uploading images to existing property
export const uploadPropertyImages = (propertyId, images) => {
  return async (dispatch) => {
    dispatch({ type: UPLOAD_PROPERTY_IMAGES_REQUEST });

    try {
      // First, get presigned URLs from backend
      const presignedResponse = await authApi.post(`/admin/properties/${propertyId}/presigned-urls`, {
        count: images.length
      });

      const { presignedUrls, imageUrls } = presignedResponse.data.data;

      // Upload images
      const uploadedImages = [];

      for (let i = 0; i < Math.min(images.length, presignedUrls.length); i++) {
        const file = images[i];
        const { url: presignedUrl, key } = presignedUrls[i];
        const { url: publicUrl } = imageUrls[i];

        // Upload to S3
        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type || 'image/jpeg',
          },
        });

        uploadedImages.push({
          key: key,
          url: publicUrl
        });
      }

      // Update property with new image URLs
      const updateResponse = await authApi.put(`/admin/properties/${propertyId}/images`, {
        images: uploadedImages
      });

      dispatch({
        type: UPLOAD_PROPERTY_IMAGES_SUCCESS,
        payload: updateResponse.data
      });

      return {
        success: true,
        data: updateResponse.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload images';
      dispatch({
        type: UPLOAD_PROPERTY_IMAGES_FAILURE,
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
      // images.forEach((image, index) => {
      //   formData.append('images', image);
      // });

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
      const response = await authApi.put(`/admin/user/${userId}`, userData, {

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
      await authApi.delete(`/admin/user/${userId}`, {

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