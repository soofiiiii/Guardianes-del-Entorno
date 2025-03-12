// Crea un área natural enviando el payload a la API
export const createNaturalArea = async (payload) => {
  // Construye la URL con el secret codificado
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/insert?secret=${encodeURIComponent('TallerReact2025!')}`;

  // Envía una petición POST con el payload en formato JSON
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  // Si la respuesta no es exitosa, lanza un error
  if (!response.ok) {
    throw new Error(`Error al crear el área natural. Status: ${response.status}`);
  }

  // Retorna la respuesta convertida a JSON
  return response.json();
};

// Lista las áreas naturales de un usuario usando su userId
export const listUserNaturalAreas = async (userId) => {
  let allAreas = [];
  let page = 1;
  let totalPages = 1; // Se actualizará con la respuesta de la API

  try {
    // Recorre todas las páginas mientras queden por consultar
    while (page <= totalPages) {
      const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!&userId=${userId}&page=${page}&pageSize=50`;
      
      console.log(`Fetching page ${page}...`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        console.warn("Respuesta vacía de la API.");
        return { items: [] };
      }

      const data = JSON.parse(text);
      
      // Agrega las áreas obtenidas a la lista total
      allAreas = [...allAreas, ...data.items];

      // Actualiza el total de páginas según la respuesta
      totalPages = data.totalPages;
      page++;

      console.log(`Página ${page - 1} obtenida, totalPages: ${totalPages}`);
    }

    console.log("Todas las áreas obtenidas:", allAreas);
    return { items: allAreas };
  } catch (error) {
    console.error("Error al obtener las áreas naturales:", error);
    return { items: [] };
  }
};

// Lista todas las áreas naturales (usando userId=0 para obtener todas)
export const listAllNaturalAreas = async (page = 1, pageSize = 10) => {
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

// Actualiza un área natural enviando userId y el objeto naturalArea con su id
export const updateNaturalArea = async ({ userId, naturalArea }) => {
  // Verifica que se proporcionen userId, naturalArea y naturalArea.id
  if (!userId || !naturalArea || !naturalArea.id) {
    console.error("Error: Datos insuficientes para actualizar el área.");
    return false;
  }

  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/update?secret=TallerReact2025!`;

  try {
    // Envía una petición PUT con los datos a actualizar
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, naturalArea }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en updateNaturalArea:", errorText);
      return false;
    }

    console.log("Área actualizada correctamente.");
    return true;
  } catch (error) {
    console.error("Error al actualizar el área:", error);
    return false;
  }
};

// Elimina un área natural enviando userId y naturalAreaId
export const deleteNaturalArea = async ({ userId, naturalAreaId }) => {
  // Verifica que se proporcionen userId y naturalAreaId
  if (!userId || !naturalAreaId) {
    console.error("Error: userId o naturalAreaId no proporcionados.");
    return false;
  }

  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/delete?secret=TallerReact2025!`;

  try {
    // Envía una petición DELETE con los datos en el body
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, naturalAreaId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en deleteNaturalArea:", errorText);
      return false;
    }

    console.log("Área eliminada correctamente.");
    return true;
  } catch (error) {
    console.error("Error al eliminar el área:", error);
    return false;
  }
};

// Busca y retorna un área natural por su ID
export const fetchNaturalAreaById = async (id) => {
  // Verifica que se proporcione un id válido
  if (!id) {
    throw new Error("El ID del área es inválido");
  }

  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!&page=1&pageSize=100`;

  try {
    // Envía una petición GET para obtener la lista de áreas
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la lista de áreas. Código: ${response.status}`);
    }

    const data = await response.json();
    // Busca el área que coincida con el id proporcionado
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

// Obtiene las áreas naturales y las guarda en cache (localStorage) en caso de fallo
export const fetchAreas = async () => {
  try {
    const response = await fetch(
      "https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!"
    );

    if (!response.ok) {
      console.warn(`Advertencia: Falló la carga de áreas con código ${response.status}`);
      // Si falla, intenta recuperar las áreas almacenadas en localStorage
      const cachedAreas = localStorage.getItem("cachedAreas");
      return cachedAreas ? JSON.parse(cachedAreas) : [];
    }

    const data = await response.json();
    
    // Guarda las áreas en localStorage para uso futuro
    localStorage.setItem("cachedAreas", JSON.stringify(data.items || []));
    
    return data.items || [];
  } catch (error) {
    console.error("Error en fetchAreas:", error);
    // En caso de error, retorna las áreas almacenadas en localStorage si existen
    const cachedAreas = localStorage.getItem("cachedAreas");
    return cachedAreas ? JSON.parse(cachedAreas) : [];
  }
};

// Busca un área natural por su nombre
export const fetchNaturalAreaByName = async (name) => {
  // Verifica que se proporcione un nombre válido
  if (!name) throw new Error("Nombre inválido para buscar el área.");

  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!&page=1&pageSize=100`;

  try {
    // Envía una petición GET para obtener la lista de áreas
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la lista de áreas. Código: ${response.status}`);
    }

    const data = await response.json();
    console.log("Lista de áreas obtenida desde la API:", data);

    // Busca el área cuyo nombre coincida (ignorando mayúsculas/minúsculas)
    const area = data.items.find(a => a.name.toLowerCase() === name.toLowerCase());

    if (!area) {
      throw new Error(`No se encontró el área con nombre ${name}`);
    }

    return area;
  } catch (error) {
    console.error('Error en fetchNaturalAreaByName:', error.message);
    throw error;
  }
};
