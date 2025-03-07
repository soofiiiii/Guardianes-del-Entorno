import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import MyPublications from './MyPublications';
import AccountSettings from './AccountSettings';
import './Dashboard.css';

const Dashboard = () => {
  // Controla qué sección se muestra a la derecha
  const [activeSection, setActiveSection] = useState('profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile />;
      case 'publications':
        return <MyPublications />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
