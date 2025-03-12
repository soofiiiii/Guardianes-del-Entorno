import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserDropdownList from "../UserDropdownList/UserDropdownList";
import UserMenu from "../UserMenu/UserMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo adaptable */}
        <Link className="navbar-brand fw-bold text-success d-none d-md-block" to="/">
          Guardianes del Entorno
        </Link>
        <Link className="navbar-brand fw-bold text-success d-block d-md-none" to="/">
          GDE
        </Link>
        
        {/* Controles fuera del menú desplegable */}
        <div className="d-flex align-items-center">
          {/* UserDropdownList contiene la barra de búsqueda responsiva */}
          {isAuthenticated && (
            <div className="d-none d-md-block">
              <UserDropdownList />
            </div>
          )}
          {isAuthenticated && (
            <div className="d-md-none dropdown">
              <button
                className="btn btn-outline-success rounded-circle"
                type="button"
                id="searchDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaSearch />
              </button>
              <ul className="dropdown-menu p-2" aria-labelledby="searchDropdown">
                <li>
                  <UserDropdownList />
                </li>
              </ul>
            </div>
          )}
          
          <div className="ms-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link to="/login" className="btn btn-success">
                Iniciar Sesión
              </Link>
            )}
          </div>
          
          {/* Botón de menú */}
          <button
            className="navbar-toggler ms-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </div>

      {/* Menú desplegable */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto text-center">
          <li className="nav-item">
            <a className="nav-link text-success" href="/posts">Publicaciones</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-success" href="#eventos">Eventos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-success" href="#foro">Foro</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-success" href="#contacto">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;