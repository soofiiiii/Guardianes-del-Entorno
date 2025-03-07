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

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage);
  const [myAreas, setMyAreas] = useState(getAreasFromStorage);

  useEffect(() => {
    const fetchUserAreas = async () => {
      if (!user || !user.id) {
        console.error("❌ No hay usuario autenticado.");
        return;
      }

      try {
        console.log(`🔍 Cargando áreas para el usuario con ID ${user.id}...`);
        console.log("📢 Usuario autenticado en AuthContext:", user);

        const data = await listUserNaturalAreas(user.id);
        console.log("📌 Áreas devueltas por la API:", data.items);

        if (data.items) {
          // 🔹 Filtramos manualmente las áreas por usuario
          const userAreas = data.items.filter(area => Number(area.userId) === Number(user.id));
          console.log("✅ Áreas filtradas correctamente:", userAreas);

          setMyAreas(userAreas);
          saveAreasToStorage(userAreas); // Guardar en localStorage
        } else {
          console.warn("⚠️ La API no devolvió áreas.");
          setMyAreas([]);
          removeAreasFromStorage();
        }
      } catch (error) {
        console.error("❌ Error al cargar áreas:", error);
        setMyAreas([]);
        removeAreasFromStorage();
      }
    };

    fetchUserAreas();
  }, [user]);

  const addArea = (area) => {
    setMyAreas((prev) => {
      const updatedAreas = [...prev, area];
      saveAreasToStorage(updatedAreas);
      return updatedAreas;
    });
  };

  const removeArea = async (areaId) => {
    if (!user || !areaId) return;
  
    try {
      console.log("🗑️ Eliminando área con ID:", areaId);
      const response = await deleteNaturalArea({ userId: user.id, naturalAreaId: areaId });
  
      if (response.result) {
        console.log("✅ Área eliminada correctamente");
  
        setMyAreas((prev) => {
          const updatedAreas = prev.filter(area => area.id !== areaId);
          saveAreasToStorage(updatedAreas);
          return updatedAreas;
        });
      } else {
        console.error("❌ La API no devolvió éxito al eliminar.");
      }
    } catch (error) {
      console.error("❌ Error al eliminar el área:", error);
    }
  };
  

  const logout = () => {
    setUser(null);
    removeUserFromStorage();
    setMyAreas([]);
    removeAreasFromStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        myAreas,
        addArea,
        removeArea,
        isAuthenticated: !!user,
        login: async (email, password) => {
          const response = await loginUser(email, password);
          if (response.isValid) {
            setUser(response.user);
            saveUserToStorage(response.user);
          }
          return response;
        },
        register: async (data) => registerUser(data),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
