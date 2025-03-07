import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Importar de la función login del AuthContext para auto-iniciar sesión
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setRegisterSuccess(false);

    try {
      // 1. Registar al usuario en la API
      const data = await registerUser({ Name: name, username, email, password });
      console.log('Registro:', data);

      // 2. Si "Result" es true, intentamos loguear automáticamente
      if (data && data.result) {
        setRegisterSuccess(true);

        // Llamar a la función login del AuthContext
        const loginResponse = await login(email, password);
        console.log('Login Response:', loginResponse);

        // 3. Si el login es válido, redirigir al Home
        if (loginResponse && loginResponse.isValid) {
          navigate('/');
        } else {
          setErrorMessage('Error al iniciar sesión tras el registro.');
        }
      } else {
        setErrorMessage('Error inesperado al registrar. Revisa la respuesta de la API.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register-page bg-light">
      <div className="register-hero d-flex align-items-center justify-content-center">
        <motion.div
          className="register-form-container bg-white p-4 shadow rounded"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-success fw-bold mb-4 text-center">Crea tu cuenta</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-success fw-semibold">
                Nombre completo
              </label>
              <input
                type="text"
                className="form-control border-success"
                id="name"
                placeholder="nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label text-success fw-semibold">
                Nombre de usuario
              </label>
              <input
                type="text"
                className="form-control border-success"
                id="username"
                placeholder="nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-success fw-semibold">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control border-success"
                id="email"
                placeholder="correo electrónico"
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
              Registrarme
            </motion.button>
          </form>

          {registerSuccess && (
            <div className="alert alert-success mt-3">
              Registro exitoso. Iniciando sesión y redirigiendo al Home...
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

export default Register;
