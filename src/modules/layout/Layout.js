import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <i className="fas fa-piggy-bank text-2xl"></i>
              <Link to="/" className="text-2xl font-bold">FinCrop</Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className={isActive('/')}>Dashboard</Link>
              <Link to="/invest" className={isActive('/invest')}>Invest</Link>
              <Link to="/portfolio" className={isActive('/portfolio')}>Portfolio</Link>
              <Link to="/profile" className={isActive('/profile')}>Profile</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-blue-800 px-3 py-1 rounded-full">
                <i className="fas fa-rupee-sign"></i>
                <span>₹25,000</span>
              </div>
              <div className="hidden md:block w-8 h-8 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-16 md:pb-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="fas fa-piggy-bank mr-2"></i> FinCrop
              </h3>
              <p className="text-gray-400">Making investment simple and accessible for every Indian.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Investments</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Stocks</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mutual Funds</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Fixed Deposits</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Gold</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Bonds</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Learn</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Calculators</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Market Research</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tax Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <i className="fas fa-phone-alt mr-2"></i> +91 98765 43210
                </li>
                <li className="flex items-center text-gray-400">
                  <i className="fas fa-envelope mr-2"></i> support@fincrop.in
                </li>
                <li className="flex items-center text-gray-400">
                  <i className="fas fa-map-marker-alt mr-2"></i> Mumbai, India
                </li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© 2023 FinCrop. All rights reserved. | <a href="#" className="hover:text-white">Privacy Policy</a> | <a href="#" className="hover:text-white">Terms of Service</a></p>
            <p className="mt-2 text-sm">FinCrop is a SEBI registered investment advisor (RIA No. INA000123456)</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="flex justify-around">
          <Link to="/" className={`flex flex-col items-center justify-center py-3 ${isActive('/') ? 'text-blue-600' : 'text-gray-600'}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/invest" className={`flex flex-col items-center justify-center py-3 ${isActive('/invest') ? 'text-blue-600' : 'text-gray-600'}`}>
            <i className="fas fa-chart-pie text-lg"></i>
            <span className="text-xs mt-1">Invest</span>
          </Link>
          <Link to="/portfolio" className={`flex flex-col items-center justify-center py-3 ${isActive('/portfolio') ? 'text-blue-600' : 'text-gray-600'}`}>
            <i className="fas fa-wallet text-lg"></i>
            <span className="text-xs mt-1">Portfolio</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center justify-center py-3 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'}`}>
            <i className="fas fa-user text-lg"></i>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%);
        }
        .nav-item.active {
          border-bottom: 3px solid #3b82f6;
          color: #3b82f6;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%);
        }
        .investment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .progress-bar {
          height: 8px;
          border-radius: 4px;
          background-color: #e5e7eb;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          background-color: #10b981;
          transition: width 0.5s ease-in-out;
          width: 0%;
        }
        .nav-item.active {
          border-bottom: 3px solid #3b82f6;
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default Layout;