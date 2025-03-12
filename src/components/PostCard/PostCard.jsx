import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateNaturalArea, deleteNaturalArea } from '../../services/naturalAreaService';
import './PostCard.css';

const PostCard = ({ area, onDelete, onUpdate }) => {
  const navigate = useNavigate();

  // Función para cambiar el estado de publicación del área
  const handlePublishToggle = async () => {
    // Calcula el nuevo estado de publicación invirtiendo el actual
    const newStatus = !area.published;

    try {
      // Prepara el payload con el nuevo estado
      const payload = {
        userId: area.userId,
        naturalArea: { ...area, published: newStatus }
      };
      // Llama al servicio para actualizar el área
      const data = await updateNaturalArea(payload);
      // Si la actualización es exitosa, actualiza el estado en el componente padre
      if (data.result || data.Success) {
        onUpdate && onUpdate(area.id, { published: newStatus });
      }
    } catch (error) {
      console.error(error);
      alert("Error al cambiar el estado de publicación.");
    }
  };

  // Función para navegar a la página de edición del área
  const handleEdit = () => {
    if (!area.id) {
      console.error("ID de área inválido:", area);
      alert("Error: ID inválido al intentar editar la publicación.");
      return;
    }
    navigate(`/editar-area/${area.id}`);
  };

  // Función para eliminar el área con confirmación del usuario
  const handleDelete = async () => {
    if (!area.id) {
      alert("Error: ID inválido al intentar eliminar.");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación y sus datos asociados?")) {
      try {
        const response = await deleteNaturalArea(area.id);
        if (response.success || response.result) {
          onDelete(area.id);
        } else {
          alert("No se pudo eliminar la publicación. Verifica si tiene datos asociados.");
        }
      } catch (error) {
        console.error("Error eliminando publicación:", error);
        alert("Ocurrió un error al eliminar la publicación.");
      }
    }
  };

  return (
    <div className="post-card">
      {/* Muestra la imagen del área */}
      <img src={area.imageUrl} alt={area.name} className="post-image" />
      <h3>{area.name}</h3>
      <p>{area.location}</p>
      <p>{area.description}</p>
      <div className="post-actions">
        {/* Botón para cambiar el estado de publicación */}
        <button onClick={handlePublishToggle}>
          {area.published ? "Despublicar" : "Publicar"}
        </button>
        {/* Botón para modificar el área */}
        <button onClick={handleEdit}>Modificar</button>
        {/* Botón para eliminar el área */}
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
};

export default PostCard;
