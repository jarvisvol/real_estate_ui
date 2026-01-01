import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import '../css/AdminLayout.css';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={`admin-layout-container ${mobileOpen ? 'sidebar-open' : ''}`}>
      <AdminSidebar 
        mobileOpen={mobileOpen}
        onMobileToggle={toggleSidebar}
      />
      
      <div className="admin-main-content">
        <AdminNavbar 
          onMenuToggle={toggleSidebar}
        />
        
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;