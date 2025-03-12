const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/user"; // URL base de la API
const SECRET = "TallerReact2025!"; // Secreto para acceder a la API

// Función para registrar un usuario
// Recibe un objeto con Name, username, email y password
// Retorna { "Result": true } si el registro es exitoso
export async function registerUser({ Name, username, email, password }) {
  try {
    // Se envía la petición POST para registrar el usuario
    const response = await fetch(`${BASE_URL}/register?secret=${SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Se manda la información del usuario dentro de "User"
      body: JSON.stringify({
        User: { Name, username, email, password },
      }),
    });

    // Si la respuesta no es exitosa, se lanza un error con el mensaje recibido
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'Error en el registro');
    }

    // Se retorna la respuesta en formato JSON
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Función para iniciar sesión
// Recibe email y password
// Retorna { user: {...}, isValid: true } si las credenciales son correctas
export async function loginUser(email, password) {
  try {
    // Se envía la petición POST para el login
    const response = await fetch(`${BASE_URL}/login?secret=${SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Se envían el email y la contraseña
      body: JSON.stringify({ email, password }),
    });

    // Si la respuesta no es exitosa, se lanza un error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'Error en el login');
    }

    // Se retorna la respuesta en formato JSON
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Función para verificar si la API está activa
// Retorna { "Success": true, "Message": "API is running" } si la API responde correctamente
export async function isApiAlive() {
  try {
    // Se hace una petición GET para comprobar el estado de la API
    const response = await fetch(`${BASE_URL}/isAlive?secret=${SECRET}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'API no responde');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Función para obtener los datos de un usuario por su ID
export const fetchUserById = async (userId) => {
  try {
    // Se hace una petición GET para obtener el usuario por su ID
    const response = await fetch(`https://mammal-excited-tarpon.ngrok-free.app/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener usuario ${userId}: ${response.status}`);
    }

    const userData = await response.json();
    console.log(`Datos del usuario ${userId}:`, userData); // Muestra la información en consola

    return userData; // Se espera que retorne un objeto con { id, name }
  } catch (error) {
    console.error(`Error al obtener usuario ${userId}:`, error);
    // Si hay error, retorna un objeto con un nombre por defecto
    return { id: userId, name: `Usuario ${userId}` };
  }
};

// Función para obtener una lista de usuarios con paginación y búsqueda
export async function fetchUsers({ page = 1, searchTerm = "" } = {}) {
  try {
    // Si se busca, se aumenta el tamaño de página para traer más resultados
    const pageSize = searchTerm ? 100 : 10;

    // Se construye la URL con los parámetros necesarios
    const url = `${BASE_URL}/list?secret=${SECRET}&page=${page}&pageSize=${pageSize}${
      searchTerm ? `&search=${searchTerm}` : ""
    }`;

    console.log("Petición a la API:", url); // Muestra la URL en consola

    // Se hace la petición GET para obtener los usuarios
    const response = await fetch(url, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta de la API:", data); // Muestra la respuesta en consola

    // Retorna el listado de usuarios o un arreglo vacío si no hay usuarios
    return data.users?.items || [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}
