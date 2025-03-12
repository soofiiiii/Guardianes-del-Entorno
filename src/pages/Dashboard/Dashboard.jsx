import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import MyAreas from './MyAreas';
import MySpecies from './MySpecies';
import MyActivities from './MyActivities';
import AccountSettings from './AccountSettings';
import './Dashboard.css';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile />;
      case 'areas':
        return <MyAreas />;
      case 'species':
        return <MySpecies />;
      case 'activities':
        return <MyActivities />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <Profile />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
