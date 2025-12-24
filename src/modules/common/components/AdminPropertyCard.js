import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminPropertyCard = ({ property, deleteProperty }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleView = () => {
    // Navigate to property details page
    navigate(`/properties/view/${property._id}`);
    console.log('View property:', property._id);
  };

  const handleEdit = () => {
    // Navigate to edit property page
    navigate(`/admin/properties/edit/${property._id}`);
    console.log('Edit property:', property._id);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProperty(property._id));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
              <img 
                src={property.images?.[0]?.url || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"} 
                alt={property.propertyAddress?.streetAddress}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {property.propertyAddress?.streetAddress || 'No Address'}
              </div>
              <div className="text-sm text-gray-500">
                {property.propertyAddress?.city && property.propertyAddress?.state 
                  ? `${property.propertyAddress.city}, ${property.propertyAddress.state}`
                  : 'Location not specified'
                }
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {property.propertyType || 'Residential'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {property.price?.currency || '₹'}{property.price?.amount?.toLocaleString() || '0'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {/* If you have bedrooms/bathrooms in your model */}
          {property.bedrooms || 'N/A'} / {property.bathrooms || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            property.status === 'active' 
              ? 'bg-green-100 text-green-800'
              : property.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : property.status === 'sold'
              ? 'bg-blue-100 text-blue-800'
              : property.status === 'draft'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-green-100 text-green-800' // Default to active
          }`}>
            {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'Active'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {property.createdAt 
            ? new Date(property.createdAt).toLocaleDateString()
            : 'N/A'
          }
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            {/* View Button */}
            <button
              onClick={handleView}
              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
              title="View Details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
              title="Edit Property"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
              title="Delete Property"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Delete Property
            </h3>
            
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPropertyCard;