import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomFooter from './components/CustomFooter';
import Navbar from './components/Navbar';

const Layout = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-16 md:pb-6">
        <Outlet />
      </main>

      {/* Footer */}
      <CustomFooter />

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