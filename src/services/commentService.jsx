const BASE_URL = "https://mammal-excited-tarpon.ngrok-free.app/api/comment"; // URL base para comentarios
const SECRET = "TallerReact2025!"; // Secreto para acceder a la API

// Función para listar comentarios por entidad (Área o Especie)
export const fetchCommentsByEntity = async (entityId, entityType, page = 1, pageSize = 10) => {
    try {
        // Define el parámetro según el tipo de entidad
        const paramKey = entityType === "species" ? "speciesId" : "naturalAreaId";

        // Realiza la petición GET para obtener los comentarios
        const response = await fetch(
            `${BASE_URL}/byEntityId?secret=${SECRET}&${paramKey}=${entityId}&page=${page}&pageSize=${pageSize}`
        );

        // Si la respuesta no es exitosa, lanza un error
        if (!response.ok) throw new Error(`Error al obtener comentarios. Código: ${response.status}`);

        // Obtiene los datos en formato JSON
        const data = await response.json();
        let comments = data.items || [];

        console.log("Comentarios obtenidos:", comments);

        // Si no existe un nombre de usuario, se asigna "Usuario {userId}"
        comments = comments.map(comment => ({
            ...comment,
            userName: comment.userName || `Usuario ${comment.userId}`
        }));

        console.log("Comentarios con nombres asignados:", comments);

        return comments;
    } catch (error) {
        console.error("Error en fetchCommentsByEntity:", error);
        return [];
    }
};

// Función para insertar un nuevo comentario
export const addComment = async (userId, entityId, entityType, text, rating) => {
    try {
        // Verifica que se tenga un userId
        if (!userId) {
            console.error("Error en addComment: userId es requerido.");
            return false;
        }

        // Construye el objeto del comentario
        const commentData = {
            userId,
            naturalAreaId: entityType === "naturalArea" ? entityId : null,
            speciesId: entityType === "species" ? entityId : null,
            text,
            rating,
        };

        console.log("Enviando comentario corregido:", JSON.stringify({ comment: commentData }, null, 2));

        // Realiza la petición POST para insertar el comentario
        const response = await fetch(`${BASE_URL}/insert?secret=${SECRET}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: commentData }),
        });

        // Si la respuesta falla, muestra el error
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

// Función para editar un comentario existente
export const updateComment = async (commentId, userId, entityId, entityType, text, rating) => {
    try {
        // Verifica que se tengan commentId y userId
        if (!commentId || !userId) {
            console.error("Error en updateComment: commentId y userId son requeridos.");
            return false;
        }

        // Muestra en consola los datos que se enviarán a la API
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

        // Realiza la petición PUT para actualizar el comentario
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

        // Si la respuesta falla, muestra el error
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

// Función para eliminar un comentario
export const deleteComment = async (userId, commentId) => {
    try {
        console.log("Enviando solicitud de eliminación:", { userId, commentId });

        // Verifica que se tenga un commentId
        if (!commentId) {
            console.error("Error: commentId es undefined.");
            return false;
        }

        // Realiza la petición DELETE pasando el commentId en la URL
        const response = await fetch(`https://mammal-excited-tarpon.ngrok-free.app/api/comments/${commentId}?userId=${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        // Si la respuesta falla, lanza un error
        if (!response.ok) {
            throw new Error(`Error en deleteComment: ${response.status} ${response.statusText}`);
        }

        console.log("Comentario eliminado correctamente.");
        return true;
    } catch (error) {
        console.error("Error en deleteComment:", error);
        return false;
    }
};
