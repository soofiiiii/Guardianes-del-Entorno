import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";
import { listUserNaturalAreas, deleteNaturalArea } from "../services/naturalAreaService";
import {
  getUserFromStorage,
  saveUserToStorage,
  removeUserFromStorage,
  getAreasFromStorage,
  saveAreasToStorage,
  removeAreasFromStorage
} from "../services/localStorageService";

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Estado para el usuario, inicializado desde localStorage
  const [user, setUser] = useState(getUserFromStorage);
  // Estado para las áreas (publicaciones) del usuario, inicializado desde localStorage
  const [myAreas, setMyAreas] = useState(getAreasFromStorage);

  // Efecto para cargar las áreas del usuario cuando éste cambia
  useEffect(() => {
    const fetchUserAreas = async () => {
      // Si no hay usuario autenticado, salir de la función
      if (!user || !user.id) {
        console.error("No hay usuario autenticado.");
        return;
      }

      try {
        // Obtener publicaciones guardadas en localStorage
        const storedPublications = JSON.parse(localStorage.getItem("misPublicaciones")) || {};

        // Extraer las publicaciones del usuario actual
        const userPublications = storedPublications[user.id] || [];

        console.log("Publicaciones recuperadas desde localStorage para usuario:", user.id, userPublications);

        if (userPublications.length > 0) {
          // Si existen publicaciones guardadas, usarlas
          setMyAreas(userPublications);
        } else {
          // Si no hay publicaciones, consultarlas a través de la API
          const data = await listUserNaturalAreas();
          console.log("Datos de la API antes del filtrado:", data.items);

          if (data.items) {
            // Filtrar las áreas del usuario por el correo electrónico
            const userAreas = data.items.filter(area => area.authorEmail === user.email);
            setMyAreas(userAreas);

            // Guardar las publicaciones del usuario en localStorage
            storedPublications[user.id] = userAreas;
            localStorage.setItem("misPublicaciones", JSON.stringify(storedPublications));
          } else {
            console.warn("La API no devolvió áreas.");
            setMyAreas([]);
          }
        }
      } catch (error) {
        console.error("Error al cargar áreas:", error);
        setMyAreas([]);
      }
    };

    fetchUserAreas();
  }, [user]);

  // Función para agregar un área a las publicaciones del usuario
  const addArea = (area) => {
    setMyAreas((prev) => {
      const updatedAreas = [...prev, area];
      saveAreasToStorage(updatedAreas);
      return updatedAreas;
    });
  };

  // Función para eliminar un área (publicación) del usuario
  const removeArea = async (areaId) => {
    if (!user || !areaId) return;
  
    try {
      console.log("Eliminando área con ID:", areaId);
      const response = await deleteNaturalArea({ userId: user.id, naturalAreaId: areaId });
  
      if (response.result) {
        console.log("Área eliminada correctamente");
  
        setMyAreas((prev) => {
          const updatedAreas = prev.filter(area => area.id !== areaId);
          saveAreasToStorage(updatedAreas);
          return updatedAreas;
        });
      } else {
        console.error("La API no devolvió éxito al eliminar.");
      }
    } catch (error) {
      console.error("Error al eliminar el área:", error);
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    if (!user || !user.id) {
      console.error("Error: No hay usuario autenticado para desloguear.");
      return;
    }

    // Recuperar publicaciones existentes en localStorage
    const storedPublications = JSON.parse(localStorage.getItem("misPublicaciones")) || {};

    // Guardar las publicaciones del usuario antes de cerrar sesión
    storedPublications[user.id] = myAreas;
    localStorage.setItem("misPublicaciones", JSON.stringify(storedPublications));

    // Limpiar el estado del usuario y de sus áreas, y eliminar el usuario del localStorage
    setUser(null);
    removeUserFromStorage();
    setMyAreas([]); // Las publicaciones se mantienen guardadas en localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        myAreas,
        addArea,
        removeArea,
        isAuthenticated: !!user,
        // Función para iniciar sesión
        login: async (email, password) => {
          const response = await loginUser(email, password);
          if (response.isValid) {
            setUser(response.user);
            saveUserToStorage(response.user);
          }
          return response;
        },
        // Función para registrar usuario
        register: async (data) => registerUser(data),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
