import React, { useState } from 'react';
import AdminSidebar from './AdminSideBar';
import AdminNavbar from './AdminNavbar';
import AdminDashboard from './AdminDashboard';
import '../css/AdminPannel.css';

const AdminPanel = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const renderContent = () => {
    switch(currentSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'properties':
        return <div>Properties Content</div>;
      case 'users':
        return <div>Users Content</div>;
      case 'roles':
        return <div>Roles Content</div>;
      case 'settings':
        return <div>Settings Content</div>;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-panel-container">
      <AdminSidebar 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      <div className="admin-main-content">
        <AdminNavbar />
        
        <main className="admin-content-area">
          <div className="dashboard-content-wrapper">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;