// Clave para almacenar el usuario en localStorage
const USER_KEY = "user";
const AREAS_KEY = "myAreas";

// Obtener usuario desde localStorage
export const getUserFromStorage = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

// Guardar usuario en localStorage
export const saveUserToStorage = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

//   Eliminar usuario del localStorage (Logout)
export const removeUserFromStorage = () => {
  localStorage.removeItem(USER_KEY);
};

//   Obtener áreas desde localStorage
export const getAreasFromStorage = () => {
  const storedAreas = localStorage.getItem(AREAS_KEY);
  return storedAreas ? JSON.parse(storedAreas) : [];
};

//   Guardar áreas en localStorage
export const saveAreasToStorage = (areas) => {
  localStorage.setItem(AREAS_KEY, JSON.stringify(areas));
};

//   Eliminar áreas del localStorage (cuando el usuario cierra sesión)
export const removeAreasFromStorage = () => {
  localStorage.removeItem(AREAS_KEY);
};
