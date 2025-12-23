import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../layout/components/Navbar';
import CustomFooter from '../../layout/components/CustomFooter';
import feather from 'feather-icons';
import '../../auth/css/Loginpage.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authActions';

const LoginPage = () => {
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/dashboard';
        }
    }, [isAuthenticated]);

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
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        dispatch(loginUser(formData.email, formData.password));
    };

    return (
        <div className="login-page">
            <Navbar />
            <main className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">
                            Login to access your account and saved properties
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form" noValidate>
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
                                    className={`form-input ${errors.email ? 'input-error' : ''}`}
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
                                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.password && (
                                <p className="error-message">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="form-options">
                            <div className="remember-me">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <label htmlFor="rememberMe" className="checkbox-label">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="login-button">
                            Login
                        </button>

                        {/* Register Link */}
                        <div className="register-link">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="register-link-text">
                                    Register
                                </Link>
                            </p>
                        </div>

                        {/* Social Login Options (Optional) */}
                        <div className="social-login">
                            <div className="divider">
                                <span>Or continue with</span>
                            </div>
                            <div className="social-buttons">
                                <button type="button" className="social-button google">
                                    <i className="fab fa-google"></i>
                                    Google
                                </button>
                                <button type="button" className="social-button facebook">
                                    <i className="fab fa-facebook"></i>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <CustomFooter />
        </div>
    );
};

export default LoginPage;