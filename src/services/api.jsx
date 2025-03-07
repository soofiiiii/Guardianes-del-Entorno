// src/services/api.js
const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/user";
const SECRET = "TallerReact2025!";

/**
 * Registra un nuevo usuario en la API.
 * Espera un objeto { Name, username, email, password }.
 * Retorna { "Result": true } si es exitoso.
 */
export async function registerUser({ Name, username, email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/register?secret=${SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        User: { Name, username, email, password },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'Error en el registro');
    }

    // Se espera { "Result": true }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Inicia sesión en la API.
 * Espera email y password.
 * Retorna { user: {...}, isValid: true } si las credenciales son correctas.
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login?secret=${SECRET}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'Error en el login');
    }

    // Se espera { user: {...}, isValid: true }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Verifica si la API está en línea.
 * Retorna { "Success": true, "Message": "API is running" }
 */
export async function isApiAlive() {
  try {
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

/**
 * Lista los usuarios, con paginación opcional.
 
export async function listUsers({ userId = 1, page = 1, pageSize = 10 } = {}) {
  try {
    const response = await fetch(
      `${BASE_URL}/list?secret=${SECRET}&userId=${userId}&page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.Message || 'Error al obtener la lista de usuarios');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
*/