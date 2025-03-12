const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/species"; // URL base para especies
const SECRET = "TallerReact2025!"; // Secreto para la API

// Crea una especie
export const createSpecies = async (payload) => {
    try {
        // Verifica que el naturalAreaId sea válido
        if (!payload.species.NaturalAreaId || isNaN(payload.species.NaturalAreaId)) {
            console.error("Error: `naturalAreaId` no es válido:", payload.species.NaturalAreaId);
            throw new Error("El área natural seleccionada es inválida.");
        }

        // Formatea el payload para enviar a la API
        const formattedPayload = {
            userId: payload.userId,
            species: {
                commonName: payload.species.CommonName,
                scientificName: payload.species.ScientificName,
                category: payload.species.Category,
                conservationStatus: payload.species.ConservationStatus,
                naturalAreaId: Number(payload.species.NaturalAreaId)
            }
        };

        console.log("Enviando payload:", JSON.stringify(formattedPayload, null, 2));

        // Envía la petición POST para crear la especie
        const response = await fetch(
            `https://mammal-excited-tarpon.ngrok-free.app/api/species/insert?secret=TallerReact2025!`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedPayload)
            }
        );

        const responseData = await response.json();

        // Si la respuesta no es exitosa, lanza un error con los detalles
        if (!response.ok) {
            console.error("Error en createSpecies:", responseData);
            throw new Error(`Error ${response.status}: ${JSON.stringify(responseData.errors)}`);
        }

        console.log("Especie creada exitosamente:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error al registrar la especie:", error);
        throw error;
    }
};

// Lista todas las especies con paginación
export const listAllSpecies = async (page = 1, pageSize = 10) => {
    // Construye la URL con el secret, página y tamaño de página
    const url = `https://mammal-excited-tarpon.ngrok-free.app/api/species/list?secret=${encodeURIComponent('TallerReact2025!')}&page=${page}&pageSize=${pageSize}`;
    
    // Envía la petición GET
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    
    // Verifica que la respuesta sea exitosa
    if (!response.ok) {
        throw new Error(`Error al listar especies. Status: ${response.status}`);
    }
    
    return response.json();
};

// Obtiene especies filtradas por el ID del área natural
export const fetchSpeciesByArea = async (naturalAreaId) => {
    try {
        // Verifica que se haya pasado un naturalAreaId
        if (!naturalAreaId) {
            console.error("Error en fetchSpeciesByArea: `naturalAreaId` es inválido.");
            return [];
        }

        let allSpecies = [];
        let page = 1;
        let totalPages = 1; // Se actualizará con la primera respuesta

        do {
            // Construye la URL para la página actual
            const url = `${BASE_URL}/list?secret=${SECRET}&page=${page}&pageSize=100`;
            console.log(`Llamando a la API de especies por área, Página: ${page}`, url);

            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener especies. Código: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Respuesta de la API (Página ${page}):`, data);

            // Agrega las especies obtenidas
            if (data.items && Array.isArray(data.items)) {
                allSpecies = [...allSpecies, ...data.items];
            }

            totalPages = data.totalPages; // Actualiza el total de páginas
            page++; // Avanza a la siguiente página

        } while (page <= totalPages);

        // Filtra las especies que pertenezcan al área indicada
        const filteredSpecies = allSpecies.filter(specie => 
            Number(specie.naturalAreaId) === Number(naturalAreaId)
        );

        console.log("Especies filtradas por área:", filteredSpecies);
        return filteredSpecies;
    } catch (error) {
        console.error("Error en fetchSpeciesByArea:", error);
        return [];
    }
};

// Obtiene especies por usuario con paginación
export const fetchSpeciesByUser = async (userId, page = 1, pageSize = 10) => {
    try {
        // Verifica que se haya pasado un userId
        if (!userId) {
            throw new Error("El userId es requerido para obtener especies.");
        }

        // Construye la URL con el userId, página y tamaño de página
        const url = `https://mammal-excited-tarpon.ngrok-free.app/api/species/byUser?secret=TallerReact2025!&userId=${userId}&page=${page}&pageSize=${pageSize}`;
        console.log("Llamando a la API:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener especies. Código: ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Error en fetchSpeciesByUser:", error);
        return [];
    }
};

// Actualiza una especie
export const updateSpecies = async (payload) => {
    try {
        // Verifica que se haya pasado el ID de la especie
        if (!payload.species.id) {
            throw new Error("El ID de la especie es requerido para actualizar.");
        }

        // Formatea el payload para la actualización
        const formattedPayload = {
            userId: payload.userId,
            species: {
                id: payload.species.id,
                commonName: payload.species.commonName,
                scientificName: payload.species.scientificName,
                category: payload.species.category,
                conservationStatus: payload.species.conservationStatus,
                naturalAreaId: Number(payload.species.naturalAreaId)
            }
        };

        console.log("Enviando actualización de especie:", JSON.stringify(formattedPayload, null, 2));

        // Envía la petición PUT para actualizar la especie
        const response = await fetch(
            `${BASE_URL}/update?secret=${SECRET}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedPayload)
            }
        );

        const responseData = await response.json();

        // Si la respuesta no es exitosa, lanza un error
        if (!response.ok) {
            console.error("Error en updateSpecies:", responseData);
            throw new Error(`Error ${response.status}: ${JSON.stringify(responseData.errors)}`);
        }

        console.log("Especie actualizada exitosamente:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error al actualizar la especie:", error);
        throw error;
    }
};

// Elimina una especie
export const deleteSpecies = async (userId, speciesId) => {
    try {
        // Verifica que se haya pasado el speciesId
        if (!speciesId) {
            throw new Error("El ID de la especie es requerido para eliminar.");
        }

        // Prepara el payload con userId y speciesId
        const payload = {
            userId: userId,
            speciesId: speciesId
        };

        console.log("Enviando solicitud de eliminación de especie:", JSON.stringify(payload, null, 2));

        // Envía la petición DELETE
        const response = await fetch(
            `${BASE_URL}/delete?secret=${SECRET}`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        const responseData = await response.json();

        // Si la respuesta no es exitosa, lanza un error
        if (!response.ok) {
            console.error("Error en deleteSpecies:", responseData);
            throw new Error(`Error ${response.status}: ${JSON.stringify(responseData.errors)}`);
        }

        console.log("Especie eliminada exitosamente:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error al eliminar la especie:", error);
        throw error;
    }
};
