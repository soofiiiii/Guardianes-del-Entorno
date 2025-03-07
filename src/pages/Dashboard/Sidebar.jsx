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
          className={activeSection === 'publications' ? 'active' : ''}
          onClick={() => setActiveSection('publications')}
        >
          Mis Publicaciones
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
