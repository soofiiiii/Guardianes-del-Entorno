import React, { useState } from 'react';

// Componente para mostrar y gestionar los comentarios
const CommentsSection = ({ comments, user, onAdd, onEdit, onDelete }) => {
  // Estado para el texto del nuevo comentario
  const [newComment, setNewComment] = useState("");
  // Estado para la calificación del comentario (valor inicial 5)
  const [rating, setRating] = useState(5);
  // Estado para el comentario que se está editando (null si no se está editando)
  const [editingComment, setEditingComment] = useState(null);

  // Función para iniciar la edición de un comentario
  const handleEdit = (comment) => {
    setEditingComment(comment);   // Guarda el comentario que se va a editar
    setNewComment(comment.text);    // Carga el texto del comentario en el textarea
    setRating(comment.rating);      // Carga la calificación actual del comentario
  };

  // Función para guardar la edición de un comentario
  const handleUpdateComment = () => {
    if (!editingComment) return;
    onEdit(editingComment.id, newComment, rating); // Llama a la función de actualización con los datos
    setEditingComment(null);  // Sale del modo edición
    setNewComment("");        // Limpia el textarea
    setRating(5);             // Resetea la calificación a 5
  };

  return (
    <>
      <h2 className="section-title">Comentarios</h2>
      
      {/* Mostrar la lista de comentarios si existen */}
      {comments.length > 0 ? (
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-card">
              {/* Muestra el nombre del usuario y el texto del comentario */}
              <p><strong>{comment.userName}:</strong> {comment.text}</p>
              {/* Muestra la calificación del comentario */}
              <p><strong>Calificación:</strong> {comment.rating} ⭐</p>
              
              {/* Si el comentario pertenece al usuario actual, mostrar opciones para editar y eliminar */}
              {comment.userId === user?.id && (
                <div className="comment-actions">
                  <button className="edit-btn" onClick={() => handleEdit(comment)}>✏ Editar</button>
                  <button className="delete-btn" onClick={() => onDelete(comment.id)}>🗑 Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay comentarios en esta área.</p>
      )}

      {/* Formulario para agregar un comentario o editar uno existente */}
      <div className="comment-form">
        <h3>{editingComment ? "Editar Comentario" : "Agregar Comentario"}</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="comment-textarea"
        />
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="rating-select"
        >
          {[5, 4, 3, 2, 1].map(value => (
            <option key={value} value={value}>
              {value} ⭐
            </option>
          ))}
        </select>
        
        {/* Muestra el botón de actualizar si se está editando, de lo contrario muestra el de enviar */}
        {editingComment ? (
          <button className="update-btn" onClick={handleUpdateComment}>Actualizar</button>
        ) : (
          <button className="submit-btn" onClick={() => onAdd(newComment, rating, setNewComment, setRating)}>
            ➕ Enviar
          </button>
        )}
      </div>
    </>
  );
};

export default CommentsSection;
