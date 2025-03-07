import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateNaturalArea, deleteNaturalArea } from '../../services/naturalAreaService';
import './PostCard.css'

const PostCard = ({ area, onDelete, onUpdate }) => {
  const navigate = useNavigate();

  const handlePublishToggle = async () => {
    // Asumimos que el área tiene una propiedad "published" (boolean)
    const newStatus = !area.published;
    try {
      const payload = {
        userId: area.userId, // Asegúrate de que el área incluya el userId cuando se creó
        naturalArea: { ...area, published: newStatus }
      };
      const data = await updateNaturalArea(payload);
      if (data.result || data.Success) {
        // Notifica al componente padre para actualizar el estado local
        onUpdate && onUpdate(area.id, { published: newStatus });
      }
    } catch (error) {
      console.error(error);
      alert("Error al cambiar el estado de publicación.");
    }
  };

  const handleEdit = () => {
    // Navegar al formulario de edición, por ejemplo: /editar-area/:id
    navigate(`/editar-area/${area.id}`);
  };

  const handleDelete = async () => {
    // Aquí puedes implementar una confirmación antes de eliminar
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      try {
        const payload = { userId: area.userId, naturalAreaId: area.id };
        const data = await deleteNaturalArea(payload);
        if (data.result || data.Success) {
          // Notifica al componente padre que se eliminó el área
          onDelete && onDelete(area.id);
        }
      } catch (error) {
        console.error(error);
        alert("Error al eliminar la publicación.");
      }
    }
  };

  return (
    <div className="post-card">
      <img src={area.imageUrl} alt={area.name} className="post-image" />
      <h3>{area.name}</h3>
      <p>{area.location}</p>
      <p>{area.description}</p>
      <div className="post-actions">
        <button onClick={handlePublishToggle}>
          {area.published ? "Despublicar" : "Publicar"}
        </button>
        <button onClick={handleEdit}>Modificar</button>
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
};

export default PostCard;
