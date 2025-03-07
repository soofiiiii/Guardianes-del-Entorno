import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { login, isAuthenticated, user } = useContext(AuthContext);
  console.log('Usuario autenticado:', user); 
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await login(email, password);
      if (!response.isValid) {
        setErrorMessage('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page bg-light">
      <div className="login-hero d-flex align-items-center justify-content-center">
        <motion.div
          className="login-form-container bg-white p-4 shadow rounded"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-success fw-bold mb-4 text-center">Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-success fw-semibold">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control border-success"
                id="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-success fw-semibold">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control border-success"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <motion.button
              type="submit"
              className="btn btn-success w-100 mt-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar Sesión
            </motion.button>
          </form>
          {isAuthenticated && (
            <div className="alert alert-success mt-3">
              Inicio de sesión exitoso. Bienvenido, {user?.name || 'usuario'}.
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger mt-3">
              {errorMessage}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
