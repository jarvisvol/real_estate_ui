import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HomePage from './modules/home/components/Homepage';
import LoginPage from './modules/auth/components/LoginPage';
import RegisterPage from './modules/auth/components/RegisterPage';
import Layout from './modules/layout/Layout';
import AdminLayout from './modules/adminpannel/components/AdminLayout';
import { verifyToken } from './modules/auth/store/authActions'
import Properties from './modules/Properties/components/Properties';
import About from './modules/About/components/About';
import Contact from './modules/contact/components/Contact';
import PropertyViewPage from './modules/Properties/components/PropertyViewPage';
import AdminPanel from './modules/adminpannel/components/AdminPannel';
import AddProperty from './modules/adminpannel/components/AddProperty';
import PropertiesTable from './modules/adminpannel/components/PropertiesTable';
import UsersTable from './modules/adminpannel/components/UserTable';
import EditProperty from './modules/adminpannel/components/EditProperty';
import AddUser from './modules/adminpannel/components/AddUser';
import EditUser from './modules/adminpannel/components/EditUser';

// Protected Route Component for regular users
class ProtectedRoute extends Component {
  render() {
    const { isAuthenticated, isLoading, children } = this.props;
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }
}

// Admin/Agent Protected Route Component
class AdminAgentProtectedRoute extends Component {
  render() {
    const { isAuthenticated, userRole, isLoading, children } = this.props;
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    // Allow both admin and agent roles
    return (isAuthenticated && ['admin', 'agent'].includes(userRole)) ? children : <Navigate to="/" replace />;
  }
}

// Admin Only Protected Route Component
class AdminOnlyProtectedRoute extends Component {
  render() {
    const { isAuthenticated, userRole, isLoading, children } = this.props;
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    // Allow only admin role
    return (isAuthenticated && userRole === 'admin') ? children : <Navigate to="/" replace />;
  }
}

// Public Route Component (redirect to appropriate page if already authenticated)
class PublicRoute extends Component {
  render() {
    const { isAuthenticated, userRole, isLoading, children } = this.props;
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (isAuthenticated) {
      // Redirect to admin panel if admin, else to home
      if (userRole === 'admin' || userRole === 'agent') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
    
    return children;
  }
}

class AppRouter extends Component {
  componentDidMount() {
    this.props.verifyToken();
  }

  render() {
    const { isLoading, isAuthenticated, user } = this.props.auth;
    const userRole = user?.role || 'user';
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <RegisterPage />
              </PublicRoute>
            } 
          />
          
          {/* Regular User Routes with Layout */}
          <Route path="/" element={<Layout />}>
            {/* Public Pages - No authentication required */}
            <Route index element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/properties" element={<Properties />} />
            
            {/* Protected Pages - Authentication still required */}
            <Route 
              path="/properties/view/:id" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                  <PropertyViewPage />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* Admin/Agent Routes with Admin Layout */}
          <Route path="/admin" element={
            <AdminAgentProtectedRoute 
              isAuthenticated={isAuthenticated} 
              userRole={userRole}
              isLoading={isLoading}
            >
              <AdminLayout />
            </AdminAgentProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminPanel />} />
            
            {/* Add Property - Accessible by both Admin and Agent */}
            <Route path="add-property" element={
              <AdminAgentProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <AddProperty />
              </AdminAgentProtectedRoute>
              } 
            />

            <Route path="/admin/properties/edit/:id" element={
              <AdminAgentProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <EditProperty />
              </AdminAgentProtectedRoute>
              } 
            />
            
            {/* Properties Management - Admin and Agent */}
            <Route path="/admin/properties" element={
              <AdminAgentProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <PropertiesTable />
              </AdminAgentProtectedRoute>
            } />
            
            {/* Users Management - Admin Only */}
            <Route path="/admin/users" element={
              <AdminOnlyProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <UsersTable />
              </AdminOnlyProtectedRoute>
            } />

            <Route path="/admin/add-user" element={
              <AdminOnlyProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <AddUser />
              </AdminOnlyProtectedRoute>
            } />

            <Route path="/admin/edit-user/:id" element={
              <AdminOnlyProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <EditUser />
              </AdminOnlyProtectedRoute>
            } />
            
            {/* Settings - Admin Only */}
            <Route path="settings" element={
              <AdminOnlyProtectedRoute 
                isAuthenticated={isAuthenticated} 
                userRole={userRole}
                isLoading={isLoading}
              >
                <div>Admin Settings</div>
              </AdminOnlyProtectedRoute>
            } />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  verifyToken: bindActionCreators(verifyToken, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);