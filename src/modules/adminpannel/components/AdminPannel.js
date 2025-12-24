import React, { useState } from 'react';
import '../css/AdminPannel.css';

const AdminPanel = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  // Your dashboard rendering logic here (without sidebar/navbar)
  const renderDashboard = () => {
    // Return just the dashboard content
    return (
      <div className="admin-dashboard-content">
        {/* Your dashboard JSX from earlier */}
      </div>
    );
  };

  return renderDashboard();
};

export default AdminPanel;