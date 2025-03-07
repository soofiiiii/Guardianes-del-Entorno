const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/comment";
const SECRET = "TallerReact2025!";

// Listar comentarios por entidad (Área o Especie)
export const fetchCommentsByEntity = async (entityId, entityType, page = 1, pageSize = 10) => {
    try {
        // Determina qué parámetro usar
        const paramKey = entityType === "species" ? "speciesId" : "naturalAreaId";

        const response = await fetch(
            `${BASE_URL}/byEntityId?secret=${SECRET}&${paramKey}=${entityId}&page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error(`Error al obtener comentarios. Código: ${response.status}`);

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Error en fetchCommentsByEntity:", error);
        return [];
    }
};

// Insertar un nuevo comentario
export const addComment = async (userId, entityId, entityType, text, rating) => {
    try {
        if (!userId) {
            console.error("Error en addComment: userId es requerido.");
            return false;
        }

        // Construcción correcta del objeto `comment`
        const commentData = {
            userId,
            naturalAreaId: entityType === "naturalArea" ? entityId : null,
            speciesId: entityType === "species" ? entityId : null,
            text,
            rating,
        };

        //   Verificar qué se enviará a la API
        console.log("Enviando comentario corregido:", JSON.stringify({ comment: commentData }, null, 2));

        const response = await fetch(`${BASE_URL}/insert?secret=${SECRET}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: commentData }), //   Ahora la estructura es correcta
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en addComment:", errorData);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error en addComment:", error);
        return false;
    }
};


// Editar un comentario
export const updateComment = async (commentId, userId, entityId, entityType, text, rating) => {
    try {
        if (!commentId || !userId) {
            console.error("Error en updateComment: commentId y userId son requeridos.");
            return false;
        }

        //   Verificar qué datos se envían a la API
        console.log("Enviando solicitud de actualización:", JSON.stringify({
            comment: {
                id: commentId,
                userId,
                naturalAreaId: entityType === "naturalArea" ? entityId : null,
                speciesId: entityType === "species" ? entityId : null,
                text,
                rating,
            },
        }, null, 2));

        const response = await fetch(`${BASE_URL}/update?secret=${SECRET}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                comment: {
                    id: commentId,
                    userId,
                    naturalAreaId: entityType === "naturalArea" ? entityId : null,
                    speciesId: entityType === "species" ? entityId : null,
                    text,
                    rating,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en updateComment:", errorData);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error en updateComment:", error);
        return false;
    }
};


//   Eliminar un comentario
export const deleteComment = async (userId, commentId) => {
    try {
        if (!userId || !commentId) {
            console.error("Error en deleteComment: userId y commentId son requeridos.");
            return false;
        }

        //   Verificar qué datos se envían a la API
        console.log("Enviando solicitud de eliminación:", JSON.stringify({ userId, id: commentId }, null, 2));

        const response = await fetch(`${BASE_URL}/delete?secret=${SECRET}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, id: commentId }), //   Estructura correcta
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en deleteComment:", errorData);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error en deleteComment:", error);
        return false;
    }
};
