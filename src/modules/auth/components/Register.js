import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerUser, clearError } from '../store/authActions';
import logo from '../../../assets/logo.png';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone_number: '',
      address: '',
      pan: '',
      policy_number: '',
      policy_type: '',
      password: '',
      password_confirmation: '',
      device_token: '',
      errors: {}
    };
    
    this.policyTypes = [
      'Life Insurance',
      'Health Insurance',
      'Motor Insurance',
      'Term Insurance',
      'Travel Insurance'
    ];
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: ''
      }
    }));
    
    // Clear Redux error if any
    if (this.props.error) {
      this.props.clearError();
    }
  };

  validateForm = () => {
    const { 
      name, 
      email, 
      phone_number, 
      address, 
      pan, 
      policy_number, 
      policy_type, 
      password, 
      password_confirmation 
    } = this.state;
    
    const errors = {};
    
    // Required field validation
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!phone_number) errors.phone_number = 'Phone number is required';
    if (!address) errors.address = 'Address is required';
    if (!policy_type) errors.policy_type = 'Policy type is required';
    if (!password) errors.password = 'Password is required';
    if (!password_confirmation) errors.password_confirmation = 'Please confirm your password';
    
    // Email validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    // Phone number validation (basic)
    if (phone_number && !/^[\d\s\-\+\(\)]{10,15}$/.test(phone_number)) {
      errors.phone_number = 'Please enter a valid phone number';
    }
    
    // PAN validation (10 characters, alphanumeric)
    if (pan && !/^[A-Z0-9]{10}$/.test(pan.toUpperCase())) {
      errors.pan = 'PAN must be 10 characters alphanumeric';
    }
    
    // Password validation
    if (password && password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Password confirmation
    if (password && password_confirmation && password !== password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }
    
    const formData = {
      name: this.state.name,
      email: this.state.email,
      phone_number: this.state.phone_number,
      address: this.state.address,
      policy_type: this.state.policy_type,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };
    
    this.props.registerUser(formData);
  };

  render() {
    const { 
      name, 
      email, 
      phone_number, 
      address, 
      policy_type, 
      password, 
      password_confirmation, 
      errors 
    } = this.state;
    
    const { isLoading, error, isAuthenticated } = this.props;
    
    // Redirect if authenticated
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50">
              <img src={logo} className="rounded-full bg-blue-50"></img>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <form className="space-y-6" onSubmit={this.handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-exclamation-circle text-red-400"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter your full name"
                      value={name}
                      onChange={this.handleChange}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter your email"
                      value={email}
                      onChange={this.handleChange}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      required
                      className={`mt-1 block w-full rounded-md border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="+91-9876543210"
                      value={phone_number}
                      onChange={this.handleChange}
                    />
                    {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      required
                      className={`mt-1 block w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter your complete address"
                      value={address}
                      onChange={this.handleChange}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                </div>

                {/* Policy Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Policy Information</h3>

                  <div>
                    <label htmlFor="policy_type" className="block text-sm font-medium text-gray-700">
                      Policy Type *
                    </label>
                    <select
                      id="policy_type"
                      name="policy_type"
                      required
                      className={`mt-1 block w-full rounded-md border ${errors.policy_type ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={policy_type}
                      onChange={this.handleChange}
                    >
                      <option value="">Select Policy Type</option>
                      {this.policyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.policy_type && <p className="mt-1 text-sm text-red-600">{errors.policy_type}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className={`mt-1 block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={this.handleChange}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                      Confirm Password *
                    </label>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      required
                      className={`mt-1 block w-full rounded-md border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Confirm your password"
                      value={password_confirmation}
                      onChange={this.handleChange}
                    />
                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                  </div>

                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-1/2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
  registerUser: bindActionCreators(registerUser, dispatch),
  clearError: bindActionCreators(clearError, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);