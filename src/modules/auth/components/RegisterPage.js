import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../layout/components/Navbar';
import CustomFooter from '../../layout/components/CustomFooter';
import feather from 'feather-icons';
import '../../auth/css/RegisterPage.css';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authActions';
import Loader from '../../common/components/Loder';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: 'text-gray-400'
    });

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Check password strength in real-time
        if (name === 'password') {
            checkPasswordStrength(value);
        }

        // Clear confirm password error when passwords match
        if (name === 'confirmPassword' && errors.confirmPassword && value === formData.password) {
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
    };

    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = 'Weak';
        let color = 'text-red-500';

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 0:
            case 1:
                message = 'Weak';
                color = 'text-red-500';
                break;
            case 2:
                message = 'Fair';
                color = 'text-yellow-500';
                break;
            case 3:
                message = 'Good';
                color = 'text-blue-500';
                break;
            case 4:
                message = 'Strong';
                color = 'text-green-500';
                break;
            default:
                message = 'Weak';
                color = 'text-red-500';
        }

        setPasswordStrength({
            score,
            message,
            color
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter and one number';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Terms agreement validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await dispatch(registerUser(formData));
            if (response.payload.success) {
                // Show success message
                alert('Registration successful! Redirecting to login...');
                
                // Redirect to login page
                navigate('/login');
            } else {
                setErrors({ 
                    submit: 'Registration failed. Please try again.' 
                });
            }
        } catch (error) {
            setErrors({ 
                submit: 'An error occurred. Please try again.' 
            });
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPassword = (field) => {
        const input = document.getElementById(field);
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    };

    return (
        <div className="register-page">
            <Loader loading={loading} />
            <Navbar />
            
            <main className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h1 className="register-title">Create Account</h1>
                        <p className="register-subtitle">
                            Join HomeHaven to save properties and get personalized recommendations
                        </p>
                    </div>

                    {errors.submit && (
                        <div className="alert alert-error">
                            <i data-feather="alert-circle" className="alert-icon"></i>
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form" noValidate>
                        {/* Full Name Input */}
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">
                                Full Name
                            </label>
                            <div className="input-container">
                                <span className="input-icon">
                                    <i data-feather="user"></i>
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`form-input-register ${errors.name ? 'input-error' : ''}`}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                />
                            </div>
                            {errors.name && (
                                <p className="error-message">{errors.name}</p>
                            )}
                        </div>

                        {/* Full phone number Input */}
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Phone Number
                            </label>
                            <div className="input-container">
                                <span className="input-icon">
                                    <i data-feather="phone"></i>
                                </span>
                                <input
                                    type="number"
                                    id="phone"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`form-input-register ${errors.phone ? 'input-error' : ''}`}
                                    placeholder="Phone Number"
                                    autoComplete="phone"
                                />
                            </div>
                            {errors.name && (
                                <p className="error-message">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <div className="input-container">
                                <span className="input-icon">
                                    <i data-feather="mail"></i>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`form-input-register ${errors.email ? 'input-error' : ''}`}
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="error-message">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                                <span className={`password-strength ${passwordStrength.color}`}>
                                    {formData.password && ` - ${passwordStrength.message}`}
                                </span>
                            </label>
                            <div className="input-container">
                                <span className="input-icon">
                                    <i data-feather="lock"></i>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-input-register ${errors.password ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => handleViewPassword('password')}
                                    aria-label="Toggle password visibility"
                                >
                                    <i data-feather="eye"></i>
                                </button>
                            </div>
                            {errors.password && (
                                <p className="error-message">{errors.password}</p>
                            )}
                            <div className="password-requirements">
                                <p className="text-sm text-gray-500 mt-1">
                                    Password must contain:
                                </p>
                                <ul className="text-xs text-gray-500 ml-4 list-disc">
                                    <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>
                                        At least 8 characters
                                    </li>
                                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>
                                        One uppercase letter
                                    </li>
                                    <li className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>
                                        One number
                                    </li>
                                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : ''}>
                                        One special character
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="input-container">
                                <span className="input-icon">
                                    <i data-feather="lock"></i>
                                </span>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`form-input-register ${errors.confirmPassword ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => handleViewPassword('confirmPassword')}
                                    aria-label="Toggle password visibility"
                                >
                                    <i data-feather="eye"></i>
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="error-message">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="form-group">
                            <div className={`terms-container ${errors.agreeToTerms ? 'terms-error' : ''}`}>
                                <input
                                    type="checkbox"
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <label htmlFor="agreeToTerms" className="checkbox-label">
                                    I agree to the{' '}
                                    <Link to="/terms" className="terms-link">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="terms-link">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {errors.agreeToTerms && (
                                <p className="error-message">{errors.agreeToTerms}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i data-feather="loader" className="animate-spin mr-2"></i>
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>

                        {/* Login Link */}
                        <div className="login-link">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="login-link-text">
                                    Login
                                </Link>
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="divider">
                            <span>Or sign up with</span>
                        </div>

                        {/* Social Signup */}
                        <div className="social-signup">
                            <button type="button" className="social-button google">
                                <i className="fab fa-google"></i>
                                Google
                            </button>
                            <button type="button" className="social-button facebook">
                                <i className="fab fa-facebook"></i>
                                Facebook
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <CustomFooter />
        </div>
    );
};

export default RegisterPage;