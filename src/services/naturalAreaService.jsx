
// Crear un área natural
export const createNaturalArea = async (payload) => {
  // Se construye la URL usando encodeURIComponent para asegurar el correcto paso del secret
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/insert?secret=${encodeURIComponent('TallerReact2025!')}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error al crear el área natural. Status: ${response.status}`);
  }

  return response.json();
};

// Listar las áreas de un usuario (filtradas por userId)
export const listUserNaturalAreas = async (userId) => {
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!&userId=${userId}&page=1&pageSize=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const text = await response.text(); // Leer respuesta como texto primero
    if (!text) {
      console.warn("⚠️ Respuesta vacía de la API.");
      return { items: [] }; // Devuelve un objeto vacío si no hay datos
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (jsonError) {
      console.error("❌ Error al convertir la respuesta a JSON:", text);
      throw jsonError;
    }
  } catch (error) {
    console.error("❌ Error al obtener las áreas naturales:", error);
    return { items: [] }; // Retornar lista vacía en caso de error
  }
};



export const listAllNaturalAreas = async (page = 1, pageSize = 10) => {
  // Usamos userId=0 para indicar que queremos todas las áreas.
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=${encodeURIComponent('TallerReact2025!')}&userId=0&page=${page}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Error al listar áreas. Status: ${response.status}`);
  }

  return response.json();
};

export const updateNaturalArea = async (payload) => {
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/update?secret=${encodeURIComponent('TallerReact2025!')}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Error al actualizar el área. Status: ${response.status}`);
  }
  
  return response.json();
};

export const deleteNaturalArea = async ({ userId, naturalAreaId }) => {
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/delete?secret=TallerReact2025!`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, naturalAreaId }),
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar el área. Status: ${response.status}`);
  }

  return response.json();
};

export const fetchNaturalAreaById = async (id) => {
  if (!id) {
    throw new Error("El ID del área es inválido");
  }

  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!&page=1&pageSize=100`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la lista de áreas. Código: ${response.status}`);
    }

    const data = await response.json();
    const area = data.items.find((a) => a.id.toString() === id.toString());

    if (!area) {
      throw new Error(`No se encontró el área con ID ${id}`);
    }

    return area;
  } catch (error) {
    console.error('Error en getAreaById:', error.message);
    throw error;
  }
};


