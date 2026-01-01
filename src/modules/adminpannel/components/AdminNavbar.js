import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminNavbar.css'; // Assuming you have a CSS file for styling
import feather from 'feather-icons';

const AdminNavbar = ({ 
    // currentSection = 'dashboard',
    user = {
        name: 'Admin User',
        role: 'Super Admin',
        avatar: 'http://static.photos/people/100x100/42',
        email: 'admin@homehaven.com'
    },
    onNotificationClick = () => {},
    onLogout = () => {},
    onProfileClick = () => {},
    onSettingsClick = () => {},
    showNotifications = true,
    onMenuToggle = () => {} // For mobile menu toggle
}) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([
        { id: 1, title: 'New Property Added', time: '5 min ago', read: false },
        { id: 2, title: 'User Registration', time: '1 hour ago', read: false },
        { id: 3, title: 'Payment Received', time: '2 hours ago', read: true },
    ]);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Listen for section changes from sidebar
        const handleSectionChange = (event) => {
            if (event.detail && event.detail.section) {
                // The section is already managed by props, but we can update if needed
            }
        };

        window.addEventListener('admin-section-change', handleSectionChange);

        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotificationsDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('admin-section-change', handleSectionChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = () => {
        if (onNotificationClick) {
            onNotificationClick();
        }
        setShowNotificationsDropdown(!showNotificationsDropdown);
    };

    const markNotificationAsRead = (id) => {
        setUnreadNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllNotificationsAsRead = () => {
        setUnreadNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const handleUserMenuToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        setShowDropdown(false);
        if (onLogout) {
            onLogout();
        } else {
            // Default logout behavior
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            navigate('/login');
        }
    };

    const handleProfileClick = () => {
        setShowDropdown(false);
        if (onProfileClick) {
            onProfileClick();
        } else {
            navigate('/admin/profile');
        }
    };

    const handleSettingsClick = () => {
        setShowDropdown(false);
        if (onSettingsClick) {
            onSettingsClick();
        } else {
            navigate('/admin/settings');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const unreadCount = unreadNotifications.filter(n => !n.read).length;

    return (
        <nav className="admin-navbar">
            <div className="navbar-container">
                {/* Left Section - Title and Mobile Menu */}
                <div className="navbar-left">
                    <button 
                        className="mobile-menu-button"
                        onClick={onMenuToggle}
                        aria-label="Toggle menu"
                    >
                        <i data-feather="menu"></i>
                    </button>
                </div>
                {/* Right Section - User Menu & Notifications */}
                <div className="navbar-right">
                    {/* Notifications */}
                    {showNotifications && (
                        <div 
                            ref={notificationRef}
                            className="notification-wrapper"
                        >
                            <button 
                                className="notification-button"
                                onClick={handleNotificationClick}
                                aria-label={`${unreadCount} notifications`}
                            >
                                <i data-feather="bell" className="bell-icon"></i>
                                {unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotificationsDropdown && (
                                <div className="notifications-dropdown">
                                    <div className="dropdown-header">
                                        <h3 className="dropdown-title">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button 
                                                className="mark-all-read"
                                                onClick={markAllNotificationsAsRead}
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="notifications-list">
                                        {unreadNotifications.length > 0 ? (
                                            unreadNotifications.map(notification => (
                                                <div 
                                                    key={notification.id}
                                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                                    onClick={() => markNotificationAsRead(notification.id)}
                                                >
                                                    <div className="notification-icon">
                                                        <i data-feather="bell"></i>
                                                    </div>
                                                    <div className="notification-content">
                                                        <div className="notification-title">
                                                            {notification.title}
                                                        </div>
                                                        <div className="notification-time">
                                                            {notification.time}
                                                        </div>
                                                    </div>
                                                    {!notification.read && (
                                                        <div className="unread-dot"></div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-notifications">
                                                <i data-feather="bell-off"></i>
                                                <p>No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="dropdown-footer">
                                        <button 
                                            className="view-all-button"
                                            onClick={() => navigate('/admin/notifications')}
                                        >
                                            View All Notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Menu */}
                    <div 
                        ref={dropdownRef}
                        className="user-menu-wrapper"
                    >
                        <button 
                            className="user-profile-button"
                            onClick={handleUserMenuToggle}
                            aria-label="User menu"
                            aria-expanded={showDropdown}
                        >
                            <div className="user-avatar">
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name}
                                        className="avatar-image"
                                    />
                                ) : (
                                    <span className="avatar-initials">
                                        {getInitials(user.name)}
                                    </span>
                                )}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                            <i 
                                data-feather="chevron-down" 
                                className={`dropdown-icon ${showDropdown ? 'rotate-180' : ''}`}
                            ></i>
                        </button>

                        {/* User Dropdown Menu */}
                        {showDropdown && (
                            <div className="user-dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="user-avatar-large">
                                        {user.avatar ? (
                                            <img 
                                                src={user.avatar} 
                                                alt={user.name}
                                                className="avatar-image-large"
                                            />
                                        ) : (
                                            <span className="avatar-initials-large">
                                                {getInitials(user.name)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="user-details">
                                        <div className="user-name-large">{user.name}</div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                </div>
                                
                                <div className="dropdown-divider"></div>
                                
                                <button 
                                    className="dropdown-item"
                                    onClick={handleProfileClick}
                                >
                                    <i data-feather="user"></i>
                                    <span>My Profile</span>
                                </button>
                                
                                <button 
                                    className="dropdown-item"
                                    onClick={handleSettingsClick}
                                >
                                    <i data-feather="settings"></i>
                                    <span>Account Settings</span>
                                </button>
                                
                                <button 
                                    className="dropdown-item"
                                    onClick={() => navigate('/admin/help')}
                                >
                                    <i data-feather="help-circle"></i>
                                    <span>Help & Support</span>
                                </button>
                                
                                <div className="dropdown-divider"></div>
                                
                                <button 
                                    className="dropdown-item logout"
                                    onClick={handleLogout}
                                >
                                    <i data-feather="log-out"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;