const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity"; // URL base de actividades de conservación
const SECRET = "TallerReact2025!"; // Secreto para acceder a la API

// Crea una nueva actividad de conservación
export const createConservationActivity = async (payload) => {
  // Construye la URL con el secreto codificado
  const url = `${BASE_URL}/insert?secret=${encodeURIComponent(SECRET)}`;
  
  console.log("Enviando payload a la API:", JSON.stringify(payload, null, 2));
  
  // Envía una petición POST con el payload en formato JSON
  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  });
  
  // Si la respuesta no es exitosa, lanza un error
  if (!response.ok) {
      throw new Error(`Error al crear la actividad. Status: ${response.status}`);
  }
  return response.json(); // Retorna la respuesta en formato JSON
};

// Actualiza una actividad de conservación existente
export const updateConservationActivity = async (payload) => {
  // Construye la URL para actualizar, incluyendo el secreto
  const url = `${BASE_URL}/update?secret=${encodeURIComponent(SECRET)}`;
  
  // Envía una petición PUT con el payload en formato JSON
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  // Si la respuesta falla, lanza un error
  if (!response.ok) {
    throw new Error(`Error al actualizar la actividad. Status: ${response.status}`);
  }
  return response.json(); // Retorna la respuesta en formato JSON
};

// Elimina una actividad de conservación
export const deleteConservationActivity = async (payload) => {
  // Construye la URL para eliminar, incluyendo el secreto
  const url = `${BASE_URL}/delete?secret=${encodeURIComponent(SECRET)}`;

  // Verifica que el payload y el ID de la actividad sean válidos
  if (!payload || !payload.id) {
    throw new Error("El payload es inválido. Falta el ID de la actividad.");
  }

  console.log("Enviando solicitud de eliminación:", JSON.stringify(payload, null, 2));

  // Envía una petición DELETE con el payload en formato JSON
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // Si la respuesta no es exitosa, lanza un error con el código de estado
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error en deleteConservationActivity:", errorText);
    throw new Error(`Error al eliminar la actividad. Código: ${response.status}`);
  }

  return response.json(); // Retorna la respuesta en formato JSON
};

// Lista las actividades de conservación de un usuario
export const listActivitiesByUser = async (userId, page = 1, pageSize = 10) => {
  // Construye la URL con parámetros de usuario, página y tamaño de página
  const url = `${BASE_URL}/byUser?secret=${encodeURIComponent(SECRET)}&userId=${userId}&page=${page}&pageSize=${pageSize}`;
  
  // Envía una petición GET
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  // Si la respuesta falla, lanza un error
  if (!response.ok) {
    throw new Error(`Error al listar actividades. Status: ${response.status}`);
  }
  return response.json(); // Retorna la respuesta en formato JSON
};

// Lista las actividades de conservación por área natural
export const listActivitiesByArea = async (naturalAreaId, page = 1, pageSize = 10) => {
  // Construye la URL con el ID del área, página y tamaño de página
  const url = `${BASE_URL}/list?secret=${encodeURIComponent(SECRET)}&naturalAreaId=${naturalAreaId}&page=${page}&pageSize=${pageSize}`;
  
  // Envía una petición GET
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  // Si la respuesta falla, lanza un error
  if (!response.ok) {
    throw new Error(`Error al listar actividades por área. Status: ${response.status}`);
  }
  return response.json(); // Retorna la respuesta en formato JSON
};

// Consulta actividades de conservación por área natural
export const fetchConservationActivitiesByArea = async (naturalAreaId, page = 1, pageSize = 10) => {
  console.log(`Consultando actividades para el área: ${naturalAreaId}, página: ${page}, tamaño: ${pageSize}`);

  try {
    // Envía una petición GET a la URL de actividades por área
    const response = await fetch(
      `https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/list?secret=TallerReact2025!&naturalAreaId=${naturalAreaId}&page=${page}&pageSize=${pageSize}`
    );

    // Si la respuesta no es exitosa, lanza un error
    if (!response.ok) {
      throw new Error(`Error al obtener actividades. Código: ${response.status}`);
    }

    const data = await response.json();
    return data.items || []; // Retorna los items o un arreglo vacío
  } catch (error) {
    console.error('Error en fetchConservationActivitiesByArea:', error);
    return [];
  }
};

// Obtiene actividades de conservación de un usuario
export const fetchActivitiesByUser = async (userId) => {
  // Construye la URL con el ID del usuario
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/byUser?secret=TallerReact2025!&userId=${userId}&page=1&pageSize=10`;
  
  // Envía una petición GET
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  
  // Si la respuesta falla, lanza un error
  if (!response.ok) {
    throw new Error(`Error al obtener actividades, status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.items; // Retorna los items de actividades
};

// Obtiene una actividad específica por su ID para un usuario
export const fetchActivityById = async (activityId, userId) => {
  // Verifica que el ID de la actividad sea válido
  if (!activityId || isNaN(activityId)) {
    console.error("ID de actividad inválido:", activityId);
    throw new Error("El ID de la actividad es inválido.");
  }

  // Construye la URL para obtener actividades del usuario
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/byUser?secret=TallerReact2025!&userId=${userId}&page=1&pageSize=50`;

  try {
    console.log("Llamando a la API para obtener todas las actividades:", url);
    
    // Envía una petición GET
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Si la respuesta falla, lanza un error
    if (!response.ok) {
      throw new Error(`Error al obtener actividades. Código: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error("No se encontraron actividades.");
    }

    // Busca la actividad con el ID correspondiente
    const activity = data.items.find(act => act.id === Number(activityId));
    
    if (!activity) {
      throw new Error("Actividad no encontrada en la API.");
    }

    console.log("Actividad encontrada:", activity);
    return activity;
  } catch (error) {
    console.error("Error en fetchActivityById:", error);
    throw error;
  }
};

// Actualiza una actividad de conservación con un payload formateado
export const updateActivity = async (payload) => {
  // URL para actualizar la actividad
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/conservation-activity/update?secret=TallerReact2025!`;

  // Verifica que el payload tenga la propiedad conservationActivity
  if (!payload || !payload.conservationActivity) {
    throw new Error("El payload es inválido. conservationActivity no está definido.");
  }

  // Formatea el payload convirtiendo los IDs a número
  const formattedPayload = {
    conservationActivity: {
      id: Number(payload.conservationActivity.id), // Asegura que el ID sea un número
      userId: Number(payload.conservationActivity.userId),
      naturalAreaId: Number(payload.conservationActivity.naturalAreaId),
      description: payload.conservationActivity.description,
      date: payload.conservationActivity.date,
    },
  };

  console.log("Enviando actualización de actividad:", JSON.stringify(formattedPayload, null, 2));

  // Envía una petición PUT con el payload formateado
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedPayload),
  });

  // Si la respuesta falla, muestra el error y lanza una excepción
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error en updateActivity:", errorText);
    throw new Error(`Error al actualizar la actividad. Código: ${response.status}`);
  }

  return response.json(); // Retorna la respuesta en formato JSON
};
