import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { removeSingleAreaFromStorage } from "../../services/localStorageService";
import { deleteNaturalArea } from "../../services/naturalAreaService";
import "./Publications.css";

const MyAreas = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filteredAreas, setFilteredAreas] = useState([]);

  useEffect(() => {
    if (!user) return;
  
    // Obtener publicaciones desde `localStorage`
    const storedPublications = JSON.parse(localStorage.getItem("misPublicaciones")) || {};
    let userPublications = storedPublications[user.id] || [];
  
    // Asegurar que cada área tiene un `id` único
    const seenIds = new Set();
    const areasWithUniqueIds = userPublications.map(area => {
      let newId = area.id || Date.now();
  
      // Asegurar que el ID no está duplicado
      while (seenIds.has(newId)) {
        newId += Math.floor(Math.random() * 1000); // Cambia ligeramente el ID para hacerlo único
      }
  
      seenIds.add(newId);
      return { ...area, id: newId };
    });
  
    console.log(" Publicaciones guardadas en localStorage para este usuario:", areasWithUniqueIds);
    setFilteredAreas(areasWithUniqueIds);
  }, [user]);
  

  // Función para eliminar una publicación
  const handleDelete = async (id) => {
      if (!user) return;

      const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta área?");
      if (!confirmDelete) return;

      try {
          // Intentar eliminar en la API
          const deleteSuccess = await deleteNaturalArea({ userId: user.id, naturalAreaId: id });

          if (!deleteSuccess) {
              alert("No se pudo eliminar el área en la API.");
              return;
          }

          console.log(" Área eliminada en la API");

          // Eliminar del localStorage
          const storedPublications = JSON.parse(localStorage.getItem("misPublicaciones")) || {};
          let userAreas = storedPublications[user.id] || [];

          // Filtrar el área eliminada
          userAreas = userAreas.filter(area => area.id !== id);

          // Guardar cambios en `localStorage`
          storedPublications[user.id] = userAreas;
          localStorage.setItem("misPublicaciones", JSON.stringify(storedPublications));

          console.log(" Área eliminada en localStorage:", JSON.stringify(userAreas, null, 2));

          // Actualizar el estado en React
          setFilteredAreas(userAreas);

          alert("Área eliminada correctamente.");
      } catch (error) {
          console.error(" Error al eliminar el área:", error);
          alert("No se pudo eliminar el área.");
      }
  };

  if (!user) {
    return <p className="text-center text-danger">Debes iniciar sesión para ver tus publicaciones.</p>;
  }

  if (filteredAreas.length === 0) {
    return <p className="text-center text-muted">No has creado ninguna publicación todavía.</p>;
  }

  return (
    <div className="publications-container">
      <h2 className="publications-title">Mis Áreas</h2>
      {filteredAreas.length === 0 ? (
        <p className="publications-empty">No has registrado áreas aún.</p>
      ) : (
        <ul className="publications-list">
          {filteredAreas.map((area) => (
            <li 
              key={area.id} 
              className="publications-item clickable"
              onClick={() => navigate(`/area-detail/${area.id}`)}
            >
              <h3>{area.name}</h3>
              <p><strong>Ubicación:</strong> {area.location}</p>
              <p><strong>Descripción:</strong> {area.description}</p>
              <div className="publications-buttons">
                <button 
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el `li` capture el clic
                    navigate(`/editar-area/${encodeURIComponent(area.name)}`);
                  }}
                >
                  ✏ Modificar
                </button>


                <button 
                  className="btn-delete" 
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el `li` capture el clic
                    handleDelete(area.id);
                  }}
                >
                  🗑 Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAreas;
