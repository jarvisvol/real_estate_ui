import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/AdminSideBar.css'; // Assuming you have a CSS file for styling
import feather from 'feather-icons';

const AdminSidebar = ({ 
    onSectionChange = () => {},
    onLogout = () => {},
    collapsed = false,
    version = '1.0.0',
    user = {
        name: 'Admin User',
        role: 'Administrator',
        avatar: null
    },
    mobileOpen = false,
    onMobileToggle = () => {}
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const sidebarRef = useRef(null);

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Determine active section from current path
        const path = location.pathname;
        const sections = {
            'dashboard': '/admin/dashboard',
            'properties': '/admin/properties',
            'listings': '/admin/listings',
            'users': '/admin/users',
            'agents': '/admin/agents',
            'roles': '/admin/roles',
            'settings': '/admin/settings',
            'analytics': '/admin/analytics'
        };

        for (const [section, sectionPath] of Object.entries(sections)) {
            if (path.includes(sectionPath)) {
                setActiveSection(section);
                break;
            }
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
                    badge: '12'
                },
                { 
                    id: 'listings', 
                    label: 'Listings', 
                    icon: 'list', 
                    path: '/admin/listings',
                    badge: '8'
                },
                { 
                    id: 'categories', 
                    label: 'Categories', 
                    icon: 'folder', 
                    path: '/admin/categories',
                    badge: null
                },
                { 
                    id: 'media', 
                    label: 'Media Library', 
                    icon: 'image', 
                    path: '/admin/media',
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
                    badge: '24'
                },
                { 
                    id: 'agents', 
                    label: 'Agents', 
                    icon: 'user-check', 
                    path: '/admin/agents',
                    badge: '6'
                },
                { 
                    id: 'roles', 
                    label: 'Roles', 
                    icon: 'key', 
                    path: '/admin/roles',
                    badge: null
                },
                { 
                    id: 'permissions', 
                    label: 'Permissions', 
                    icon: 'shield', 
                    path: '/admin/permissions',
                    badge: null
                }
            ]
        },
        {
            group: 'System',
            items: [
                { 
                    id: 'settings', 
                    label: 'Settings', 
                    icon: 'settings', 
                    path: '/admin/settings',
                    badge: null
                },
                { 
                    id: 'analytics', 
                    label: 'Analytics', 
                    icon: 'bar-chart-2', 
                    path: '/admin/analytics',
                    badge: null
                },
                { 
                    id: 'reports', 
                    label: 'Reports', 
                    icon: 'file-text', 
                    path: '/admin/reports',
                    badge: '3'
                },
                { 
                    id: 'logs', 
                    label: 'Activity Logs', 
                    icon: 'activity', 
                    path: '/admin/logs',
                    badge: null
                }
            ]
        }
    ];

    const handleSectionClick = (section) => {
        setActiveSection(section.id);
        
        // Navigate to the section path
        navigate(section.path);
        
        // Notify parent component
        if (onSectionChange) {
            onSectionChange(section.id, section.label);
        }

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('admin-section-change', { 
            detail: {
                section: section.id,
                label: section.label,
                path: section.path
            }
        }));

        // Close mobile sidebar if open
        if (mobileOpen && onMobileToggle) {
            onMobileToggle();
        }
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            // Default logout behavior
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            navigate('/login');
        }
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
                            <i data-feather="home" className="logo-icon"></i>
                            {!isCollapsed && (
                                <span className="logo-text">HomeHaven Admin</span>
                            )}
                        </div>
                        
                        {/* Mobile close button */}
                        <button 
                            className="mobile-close"
                            onClick={onMobileToggle}
                            aria-label="Close menu"
                        >
                            <i data-feather="x"></i>
                        </button>

                        {/* Collapse toggle (desktop only) */}
                        <button 
                            className="collapse-toggle"
                            onClick={toggleCollapse}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <i data-feather={isCollapsed ? "chevron-right" : "chevron-left"}></i>
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
                                        <i data-feather={item.icon} className="nav-icon"></i>
                                        {!isCollapsed && (
                                            <>
                                                <span className="nav-item-text">{item.label}</span>
                                                {item.badge && (
                                                    <span className="nav-badge">{item.badge}</span>
                                                )}
                                            </>
                                        )}
                                        {!isCollapsed && activeSection === item.id && (
                                            <i data-feather="chevron-right" className="nav-active-indicator"></i>
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
                                    <i data-feather="plus"></i>
                                    <span>New Property</span>
                                </button>
                                <button 
                                    className="quick-action-button secondary"
                                    onClick={() => navigate('/admin/add-user')}
                                    aria-label="Add new user"
                                >
                                    <i data-feather="user-plus"></i>
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
                            <i data-feather="log-out" className="logout-icon"></i>
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