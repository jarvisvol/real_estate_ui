import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <header className="navbar gradient-bg text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-piggy-bank text-2xl"></i>
                        <Link to="/" className="text-2xl font-bold logo">
                            Balaji Housings
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className={isActive('/')}>
                            Home
                        </Link>
                        <Link to="/properties" className={isActive('/properties')}>
                            Properties
                        </Link>
                        <Link to="/about" className={isActive('/about')}>
                            About
                        </Link>
                        <Link to="/contact" className={isActive('/contact')}>
                            Contact
                        </Link>
                    </nav>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-2 bg-blue-800 px-3 py-1 rounded-full balance">
                            <i className="fas fa-rupee-sign"></i>
                            <span>₹25,000</span>
                        </div>
                        <div className="hidden md:block w-8 h-8 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold user-avatar">
                            A
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
                <div className="flex justify-around">
                    <Link to="/" className={`flex flex-col items-center justify-center py-3 ${isActive('/') ? 'text-blue-600' : 'text-gray-600'}`}>
                        <i className="fas fa-home text-lg"></i>
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link to="/properties" className={`flex flex-col items-center justify-center py-3 ${isActive('/properties') ? 'text-blue-600' : 'text-gray-600'}`}>
                        <i className="fas fa-chart-pie text-lg"></i>
                        <span className="text-xs mt-1">Properties</span>
                    </Link>
                    <Link to="/about" className={`flex flex-col items-center justify-center py-3 ${isActive('/about') ? 'text-blue-600' : 'text-gray-600'}`}>
                        <i className="fas fa-wallet text-lg"></i>
                        <span className="text-xs mt-1">About</span>
                    </Link>
                    <Link to="/contact" className={`flex flex-col items-center justify-center py-3 ${isActive('/contact') ? 'text-blue-600' : 'text-gray-600'}`}>
                        <i className="fas fa-user text-lg"></i>
                        <span className="text-xs mt-1">Contact</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;