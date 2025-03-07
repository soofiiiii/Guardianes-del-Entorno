const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity";
const SECRET = "TallerReact2025!";

// Insertar una nueva actividad de conservación
export const createConservationActivity = async (payload) => {
  const url = `${BASE_URL}/insert?secret=${encodeURIComponent(SECRET)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Error al crear la actividad. Status: ${response.status}`);
  }
  return response.json();
};

// Modificar una actividad de conservación existente
export const updateConservationActivity = async (payload) => {
  const url = `${BASE_URL}/update?secret=${encodeURIComponent(SECRET)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Error al actualizar la actividad. Status: ${response.status}`);
  }
  return response.json();
};

// Eliminar una actividad de conservación
export const deleteConservationActivity = async (payload) => {
  const url = `${BASE_URL}/delete?secret=${encodeURIComponent(SECRET)}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Error al eliminar la actividad. Status: ${response.status}`);
  }
  return response.json();
};

// Listar actividades de conservación por usuario
export const listActivitiesByUser = async (userId, page = 1, pageSize = 10) => {
  const url = `${BASE_URL}/byUser?secret=${encodeURIComponent(SECRET)}&userId=${userId}&page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`Error al listar actividades. Status: ${response.status}`);
  }
  return response.json();
};

// Listar actividades de conservación por área natural 
export const listActivitiesByArea = async (naturalAreaId, page = 1, pageSize = 10) => {
  const url = `${BASE_URL}/list?secret=${encodeURIComponent(SECRET)}&naturalAreaId=${naturalAreaId}&page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`Error al listar actividades por área. Status: ${response.status}`);
  }
  return response.json();
};

export const fetchConservationActivitiesByArea = async (naturalAreaId, page = 1, pageSize = 10) => {
  console.log(`Consultando actividades para el área: ${naturalAreaId}, página: ${page}, tamaño: ${pageSize}`);

  try {
    const response = await fetch(
      `https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/list?secret=TallerReact2025!&naturalAreaId=${naturalAreaId}&page=${page}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error(`Error al obtener actividades. Código: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error en fetchConservationActivitiesByArea:', error);
    return [];
  }
};

