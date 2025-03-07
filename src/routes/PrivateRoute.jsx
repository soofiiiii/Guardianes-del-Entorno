import React, { useContext} from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if(!user) {
        // Redirige a la página de login si no está autenticado
        return <Navigate to="/login" />; 
    }

    return children;
}

export default PrivateRoute;