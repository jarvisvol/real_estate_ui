import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/AdminSideBar.css';
import { logoutUser } from '../../auth/store/authActions';

const AdminSidebar = ({
    onSectionChange = () => { },
    onLogout = () => { },
    collapsed = false,
    version = '1.0.0',
    user = {
        name: 'Admin User',
        role: 'Administrator',
        avatar: null
    },
    mobileOpen = false,
    onMobileToggle = () => { }
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const sidebarRef = useRef(null);

    useEffect(() => {
        // Determine active section from current path
        const path = location.pathname;
        if (path.includes('/admin/properties')) {
            setActiveSection('properties');
        } else if (path.includes('/admin/users')) {
            setActiveSection('users');
        } else if (path.includes('/admin/agents')) {
            setActiveSection('agents');
        } else if (path.includes('/admin/dashboard')) {
            setActiveSection('dashboard');
        } else {
            setActiveSection('dashboard');
        }
    }, [location]);

    // Enhanced menu items
    const menuItems = [
        {
            group: 'Main',
            items: [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: 'layout',
                    path: '/admin/dashboard',
                    badge: null
                }
            ]
        },
        {
            group: 'Content',
            items: [
                {
                    id: 'properties',
                    label: 'Properties',
                    icon: 'home',
                    path: '/admin/properties',
                    badge: null
                }
            ]
        },
        {
            group: 'Users',
            items: [
                {
                    id: 'users',
                    label: 'Users',
                    icon: 'users',
                    path: '/admin/users',
                    badge: null
                }
            ]
        }
    ];

    const handleSectionClick = (section) => {
        console.log("Navigating to:", section);

        setActiveSection(section.id);

        // Navigate to the section path
        navigate(section.path);

        // Notify parent component
        if (onSectionChange) {
            onSectionChange(section.id, section.label);
        }

        // Close mobile sidebar if open
        if (mobileOpen && onMobileToggle) {
            onMobileToggle();
        }
    };

    const handleLogout = () => {
        navigate('/login');
        logoutUser();
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
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

    // Handle click outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest('.mobile-menu-button')) {
                onMobileToggle();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileOpen, onMobileToggle]);

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onMobileToggle}
                    role="presentation"
                />
            )}

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
            >
                <div className="sidebar-container">
                    {/* Logo Section */}
                    <div className="logo-section">
                        <div className="logo" onClick={() => handleSectionClick({ id: 'dashboard', path: '/admin/dashboard' })}>
                            <div className="logo-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            {!isCollapsed && (
                                <span className="logo-text">HomeHaven</span>
                            )}
                        </div>

                        {/* Mobile close button */}
                        <button
                            className="mobile-close"
                            onClick={onMobileToggle}
                            aria-label="Close menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* Collapse toggle (desktop only) */}
                        <button
                            className="collapse-toggle"
                            onClick={toggleCollapse}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isCollapsed ? (
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                ) : (
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="nav-menu">
                        {menuItems.map((group) => (
                            <div key={group.group} className="nav-group">
                                {!isCollapsed && (
                                    <div className="nav-group-title">{group.group}</div>
                                )}
                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                                        onClick={() => handleSectionClick(item)}
                                        aria-label={item.label}
                                        aria-current={activeSection === item.id ? 'page' : undefined}
                                    >
                                        <div className="nav-icon">
                                            {item.icon === 'layout' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                                </svg>
                                            )}
                                            {item.icon === 'home' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                                </svg>
                                            )}
                                            {item.icon === 'users' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="9" cy="7" r="4"></circle>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                </svg>
                                            )}
                                            {item.icon === 'user-check' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="8.5" cy="7" r="4"></circle>
                                                    <polyline points="17 11 19 13 23 9"></polyline>
                                                </svg>
                                            )}
                                        </div>
                                        {!isCollapsed && (
                                            <>
                                                <span className="nav-item-text">{item.label}</span>
                                                {item.badge && (
                                                    <span className="nav-badge">{item.badge}</span>
                                                )}
                                            </>
                                        )}
                                        {!isCollapsed && activeSection === item.id && (
                                            <div className="nav-active-indicator">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </nav>

                    {/* Footer Section */}
                    <div className="sidebar-footer">
                        {/* Quick Actions */}
                        {!isCollapsed && (
                            <div className="quick-actions">
                                <button
                                    className="quick-action-button primary"
                                    onClick={() => navigate('/admin/add-property')}
                                    aria-label="Add new property"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    <span>New Property</span>
                                </button>
                                <button
                                    className="quick-action-button secondary"
                                    onClick={() => navigate('/admin/add-user')}
                                    aria-label="Add new user"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <line x1="20" y1="8" x2="20" y2="14"></line>
                                        <line x1="23" y1="11" x2="17" y2="11"></line>
                                    </svg>
                                    <span>New User</span>
                                </button>
                            </div>
                        )}

                        {/* User Profile */}
                        <div
                            className="user-profile"
                            onClick={() => navigate('/admin/profile')}
                            role="button"
                            tabIndex={0}
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
                            {!isCollapsed && (
                                <div className="user-info">
                                    <div className="user-name">{user.name}</div>
                                    <div className="user-role">{user.role}</div>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                            aria-label="Logout"
                        >
                            <div className="logout-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                            </div>
                            {!isCollapsed && (
                                <span className="logout-text">Logout</span>
                            )}
                        </button>

                        {/* Version */}
                        {!isCollapsed && (
                            <div className="version-info">
                                v{version}
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;