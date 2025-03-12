import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { registerUser } from '../../services/api'; // Función para registrar usuario en la API
import './AuthSplit.css';
import Navbar from '../Navbar/Navbar';

function AuthSplit() {
  // Hook para navegación
  const navigate = useNavigate();
  // Obtiene la función login del contexto de autenticación
  const { login } = useContext(AuthContext);

  // Estados para el formulario de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  // Estados para el formulario de Registro
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // Variantes de animación para el fade in con framer-motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  // Función para manejar el Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      // Llama a la función login con el correo y contraseña ingresados
      const response = await login(loginEmail, loginPassword);
      if (response && response.isValid) {
        // Si el login es exitoso, navega a la página principal
        navigate('/');
      } else {
        setLoginError('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  // Función para manejar el Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(false);
    try {
      // Llama a la función registerUser con los datos de registro
      const data = await registerUser({
        Name: regName,
        username: regUsername,
        email: regEmail,
        password: regPassword
      });
      if (data && data.result) {
        setRegSuccess(true);
        // Auto-login tras un registro exitoso
        const loginResponse = await login(regEmail, regPassword);
        if (loginResponse && loginResponse.isValid) {
          navigate('/');
        } else {
          setRegError('Error al iniciar sesión tras el registro.');
        }
      } else {
        setRegError('Error inesperado al registrar.');
      }
    } catch (error) {
      setRegError(error.message);
    }
  };

  return (
    <>
      {/* Barra de navegación */}
      <Navbar />
      <div className="auth-split-container">
        {/* Ola decorativa */}
        <div className="wave-shape">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none">
            <path
              d="M0.00,49.98 C150.00,150.00 349.19,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"
              style={{ stroke: 'none', fill: '#FFFFFF' }}
            ></path>
          </svg>
        </div>

        {/* Panel izquierdo: Login */}
        <div className="left-panel">
          <motion.div
            className="login-section"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Iniciar Sesión
              </motion.button>
            </form>
            {loginError && <p className="error-msg">{loginError}</p>}
          </motion.div>
        </div>

        {/* Panel derecho: Registro */}
        <div className="right-panel">
          <motion.div
            className="register-section"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h2>Crear Cuenta</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Registrarme
              </motion.button>
            </form>
            {regSuccess && (
              <p className="success-msg">Registro exitoso. Iniciando sesión...</p>
            )}
            {regError && <p className="error-msg">{regError}</p>}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default AuthSplit;
