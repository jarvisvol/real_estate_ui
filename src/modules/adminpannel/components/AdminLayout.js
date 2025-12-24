import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import '../css/AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`admin-layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <AdminSidebar 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="admin-main-content">
        <AdminNavbar 
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;