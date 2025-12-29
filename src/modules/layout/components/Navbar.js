import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../auth/store/authActions';
import '../css/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mobileMenuRef = useRef(null);
    const userMenuRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
        setIsUserMenuOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: 'fas fa-home' },
        { path: '/properties', label: 'Properties', icon: 'fas fa-building' },
        { path: '/about', label: 'About', icon: 'fas fa-info-circle' },
        { path: '/contact', label: 'Contact Us', icon: 'fas fa-envelope' },
    ];

    if (user?.role === 'admin') {
        navLinks.push({ path: '/admin', label: 'Admin Panel', icon: 'fas fa-cogs' });
    }

    // User menu items
    const userMenuItems = user ? [
        { label: 'Profile', icon: 'fas fa-user-circle', action: () => navigate('/profile') },
        { label: 'Dashboard', icon: 'fas fa-tachometer-alt', action: () => navigate('/dashboard') },
        { label: 'My Properties', icon: 'fas fa-home', action: () => navigate('/my-properties') },
        { label: 'Settings', icon: 'fas fa-cog', action: () => navigate('/settings') },
        { label: 'Logout', icon: 'fas fa-sign-out-alt', action: handleLogout, isLogout: true },
    ] : [
        { label: 'Login', icon: 'fas fa-sign-in-alt', action: () => navigate('/login') },
        { label: 'Register', icon: 'fas fa-user-plus', action: () => navigate('/register') },
    ];

    return (
        <>
            <header className={`navbar gradient-bg text-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl py-2' : 'shadow-lg py-4'
                }`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <i data-feather="home"></i>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold logo-home tracking-tight">Balaji Housings</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-6 py-3 rounded-lg transition-all duration-300 font-medium group ${isActive(link.path)
                                            ? 'text-white'
                                            : 'text-white/90 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <i className={`${link.icon} mr-2`}></i>
                                    {link.label}
                                    {isActive(link.path) && (
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop User Actions */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/20 transition-all duration-300 group"
                                    >
                                        <div className="text-left">
                                            <p className="font-semibold text-sm">{user.name}</p>
                                            <p className="text-xs text-white/70 capitalize">{user.role}</p>
                                        </div>
                                        <i className={`fas fa-chevron-${isUserMenuOpen ? 'up' : 'down'} text-sm transition-transform duration-300`}></i>
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-fadeIn">
                                            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-50 to-green-50">
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="py-2">
                                                {userMenuItems.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={item.action}
                                                        className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 ${item.isLogout ? 'border-t border-gray-100 hover:text-red-600' : ''
                                                            }`}
                                                    >
                                                        <i className={`${item.icon} w-5 ${item.isLogout ? 'text-red-500' : 'text-gray-600'}`}></i>
                                                        <span className={`${item.isLogout ? 'font-medium' : ''}`}>{item.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className="px-6 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-900 hover:from-blue-600 hover:to-blue-1000 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center space-x-4">
                            {user && (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                                            <div className="p-3 border-b border-gray-700">
                                                <p className="font-semibold text-white text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-300">{user.role}</p>
                                            </div>
                                            {userMenuItems.map((item, index) => (
                                                <button
                                                    key={index}
                                                    onClick={item.action}
                                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-800 ${item.isLogout ? 'border-t border-gray-700 hover:text-red-400' : ''
                                                        }`}
                                                >
                                                    <i className={`${item.icon} w-5 ${item.isLogout ? 'text-red-400' : 'text-gray-300'}`}></i>
                                                    <span>{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
                            >
                                <i className={`fas fa-${isMobileMenuOpen ? 'times' : 'bars'} text-xl`}></i>
                            </button> */}
                        </div>
                    </div>

                    {/* Mobile Fullscreen Menu */}
                    {isMobileMenuOpen && (
                        <div
                            ref={mobileMenuRef}
                            className="lg:hidden fixed inset-0 top-20 bg-gradient-to-b from-gray-900 to-gray-800 z-40 overflow-y-auto animate-slideIn"
                        >
                            <div className="container mx-auto px-4 py-8">
                                {/* User Info (Mobile) */}
                                {user && (
                                    <div className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 flex items-center justify-center shadow-lg">
                                                <i className="fas fa-user text-2xl text-white"></i>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{user.name}</h3>
                                                <p className="text-white/70 text-sm">{user.email}</p>
                                                <span className="inline-block mt-1 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Navigation Links */}
                                <div className="space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 ${isActive(link.path)
                                                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-800/20 border-l-4 border-blue-400'
                                                    : 'hover:bg-white/10'
                                                }`}
                                        >
                                            <i className={`${link.icon} text-xl w-8`}></i>
                                            <span className="text-lg font-medium">{link.label}</span>
                                            {isActive(link.path) && (
                                                <i className="fas fa-chevron-right ml-auto text-blue-400"></i>
                                            )}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Auth Buttons */}
                                {!user && (
                                    <div className="mt-8 space-y-4">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-900 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg"
                                        >
                                            Create Account
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile User Menu Items (when logged in) */}
                                {user && (
                                    <div className="mt-8 space-y-2">
                                        {userMenuItems.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    item.action();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 hover:bg-white/10 ${item.isLogout ? 'border-t border-white/10 mt-4 pt-4 hover:text-red-400' : ''
                                                    }`}
                                            >
                                                <i className={`${item.icon} text-xl w-8 ${item.isLogout ? 'text-red-400' : 'text-white/70'}`}></i>
                                                <span className="text-lg font-medium">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md shadow-2xl border-t border-gray-700/50 z-40">
                <div className="flex justify-around items-center py-3">
                    {navLinks.slice(0, 4).map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${isActive(link.path)
                                    ? 'text-white bg-gradient-to-r from-blue-500/30 to-blue-900/30'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            <i className={`${link.icon} text-lg mb-1`}></i>
                            <span className="text-xs font-medium">{link.label}</span>
                        </Link>
                    ))}
                    <Link
                        to={user ? '/profile' : '/login'}
                        className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 ${isActive(user ? '/profile' : '/login')
                                ? 'text-white bg-gradient-to-r from-blue-500/30 to-blue-900/30'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        <i className={`fas fa-${user ? 'user' : 'sign-in-alt'} text-lg mb-1`}></i>
                        <span className="text-xs font-medium">{user ? 'Profile' : 'Login'}</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;