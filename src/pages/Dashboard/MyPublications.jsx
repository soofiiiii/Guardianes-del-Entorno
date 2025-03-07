import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPublications = () => {
  const { user, myAreas, removeArea } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("👤 Usuario autenticado:", user);
  console.log("  Publicaciones cargadas en el componente (antes de filtrar):", myAreas);

  if (!user) {
    return <p>Debes iniciar sesión para ver tus publicaciones.</p>;
  }

  // ✅ Filtrar solo las áreas del usuario autenticado
  const filteredAreas = myAreas.filter(area => Number(area.userId) === Number(user.id));
  
  console.log("📌 Publicaciones filtradas para este usuario:", filteredAreas);

  if (!Array.isArray(filteredAreas) || filteredAreas.length === 0) {
    return <p>No has creado ninguna publicación todavía.</p>;
  }

  return (
    <div>
      <h2>Mis Publicaciones</h2>
      <ul>
        {filteredAreas.map((area) => (
          <li key={area.id}>
            <h3>{area.name}</h3>
            <p>{area.location}</p>
            <p>{area.description}</p>
            <div>
              <button onClick={() => navigate(`/editar-area/${area.id}`)}>Modificar</button>
              <button onClick={() => removeArea(area.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPublications;
