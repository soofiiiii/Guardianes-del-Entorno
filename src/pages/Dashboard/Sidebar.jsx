import React from 'react';
import './Dashboard.css';
import { FaUser } from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="sidebar">
      {/* Ícono de usuario */}
      <div className="sidebar-header">
        <FaUser className="user-icon" />
      </div>

      {/* Opciones del menú */}
      <ul className="sidebar-menu">
        <li 
          className={activeSection === 'profile' ? 'active' : ''}
          onClick={() => setActiveSection('profile')}
        >
          Perfil
        </li>
        <li 
          className={activeSection === 'areas' ? 'active' : ''} 
          onClick={() => setActiveSection('areas')}
        >
          Mis Áreas
        </li>
        <li 
          className={activeSection === 'species' ? 'active' : ''} 
          onClick={() => setActiveSection('species')}
        >
          Mis Especies
        </li>
        <li 
          className={activeSection === 'activities' ? 'active' : ''} 
          onClick={() => setActiveSection('activities')}
        >
          Mis Actividades
        </li>
        <li 
          className={activeSection === 'settings' ? 'active' : ''}
          onClick={() => setActiveSection('settings')}
        >
          Ajustes de Cuenta
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
