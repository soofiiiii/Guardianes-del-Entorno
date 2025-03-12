import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './UserMenu.css';

const UserMenu = () => {
  const { logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [publicationMenuOpen, setPublicationMenuOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    if (menuOpen) setPublicationMenuOpen(false);
  };

  const togglePublicationMenu = () => {
    setPublicationMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setPublicationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <FaUserCircle
        className="user-menu-icon text-success"
        onClick={toggleMenu}
      />

      {menuOpen && (
        <div className="user-menu-dropdown position-absolute mt-2">
          <ul className="user-menu-list">
            <li className="user-menu-item">
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="user-menu-link">
                Mi Cuenta
              </Link>
            </li>

            <li className="user-menu-item" onClick={togglePublicationMenu}>
              <span className="user-menu-link">Crear Publicación</span>
              {publicationMenuOpen && (
                <ul className="publication-submenu">
                  <li className="publication-menu-item">
                    <Link to="/crear-area" onClick={() => { setMenuOpen(false); setPublicationMenuOpen(false); }} className="user-menu-link">
                      Nueva Área Natural
                    </Link>
                  </li>
                  <li className="publication-menu-item">
                    <Link to="/crear-especie" onClick={() => { setMenuOpen(false); setPublicationMenuOpen(false); }} className="user-menu-link">
                      Nueva Especie Avistada
                    </Link>
                  </li>
                  <li className="publication-menu-item">
                    <Link to="/crear-actividad" onClick={() => { setMenuOpen(false); setPublicationMenuOpen(false); }} className="user-menu-link">
                      Nueva Actividad
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className="user-menu-item">
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="user-menu-link">
                Ajustes
              </Link>
            </li>

            <li className="user-menu-item" onClick={handleLogout}>
              <span className="user-menu-link">Cerrar Sesión</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;