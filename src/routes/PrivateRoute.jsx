import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  // Obtiene el usuario desde el contexto de autenticación
  const { user } = useContext(AuthContext);

  // Si no hay usuario, redirige a la página de login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si hay usuario, renderiza los componentes hijos
  return children;
};

export default PrivateRoute;
