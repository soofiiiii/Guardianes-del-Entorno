const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/species";
const SECRET = "TallerReact2025!";


export const createSpecies = async (payload) => {
    const response = await fetch(
        'https://mammal-excited-tarpon.ngrok-free.app/api/species/insert', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }
    );

    if(!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    return response.json();
};

export const listAllSpecies = async (page = 1, pageSize = 10) => {
  const url = `https://mammal-excited-tarpon.ngrok-free.app/api/species/list?secret=${encodeURIComponent('TallerReact2025!')}&page=${page}&pageSize=${pageSize}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`Error al listar especies. Status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchSpeciesByArea = async (naturalAreaId, page = 1, pageSize = 10) => {
  try {
      if (!naturalAreaId) {
          console.error("❌ Error en fetchSpeciesByArea: `naturalAreaId` es inválido.");
          return [];
      }

      const response = await fetch(
          `${BASE_URL}/list?secret=${SECRET}&naturalAreaId=${naturalAreaId}&page=${page}&pageSize=${pageSize}`
      );

      if (!response.ok) {
          throw new Error(`Error al obtener especies. Código: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
  } catch (error) {
      console.error("❌ Error en fetchSpeciesByArea:", error);
      return [];
  }
};
