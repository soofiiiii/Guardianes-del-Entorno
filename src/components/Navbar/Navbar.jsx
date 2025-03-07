import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import UserProfile from '../../pages/UserProfile/UserProfile';
import UserMenu from '../UserMenu/UserMenu';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success" to="/">
          Guardianes del Entorno
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Links siempre visibles */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-success" href="#inicio">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-success" href="/posts">
                Publicaciones
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-success" href="#eventos">
                Eventos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-success" href="#foro">
                Foro
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-success" href="#contacto">
                Contacto
              </a>
            </li>

            {/* Dropdown para mostrar el listado de usuarios solo si está autenticado */}
            {isAuthenticated && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-success"
                  href="#"
                  id="usuariosDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Otros Usuarios
                </a>
                <ul className="dropdown-menu" aria-labelledby="usuariosDropdown">
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <UserProfile />
                  </div>
                  <li>
                    <Link className="dropdown-item text-center" to="/user-list">
                      Ver más
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Ícono si está autenticado o botones de registro e inicio de sesión si no */}
          <div className="d-flex ms-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login" className="btn btn-success">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
