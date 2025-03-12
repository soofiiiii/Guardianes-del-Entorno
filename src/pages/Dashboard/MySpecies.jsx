import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchSpeciesByUser, deleteSpecies } from "../../services/speciesService";
import { fetchAreas } from "../../services/naturalAreaService";
import "./Publications.css";

const MySpecies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [species, setSpecies] = useState([]);
  const [areas, setAreas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpeciesAndAreas = async () => {
      try {
        const speciesData = await fetchSpeciesByUser(user.id);
        const areasData = await fetchAreas();

        const areaMap = {};
        areasData.forEach(area => {
          areaMap[area.id] = area.name;
        });

        setAreas(areaMap);
        setSpecies(speciesData);
      } catch (err) {
        console.error("Error al obtener especies o áreas:", err);
        setError("No se pudieron cargar las especies.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id !== 0) {
      loadSpeciesAndAreas();
    }
  }, [user.id]);

  // 🚨 Función para eliminar una especie
  const handleDelete = async (speciesId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta especie?");
    if (!confirmDelete) return;

    try {
      await deleteSpecies(user.id, speciesId);
      setSpecies(species.filter(sp => sp.id !== speciesId));
      alert("Especie eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la especie:", error);
      alert("No se pudo eliminar la especie.");
    }
  };

  // 🚨 Función para modificar una especie (redirige al formulario de edición)
  const handleEdit = (species) => {
    navigate(`/edit-species/${species.id}`, { state: { species } });
  };

  if (loading) return <p className="publications-empty">Cargando especies...</p>;
  if (error) return <p className="publications-empty">{error}</p>;

  return (
    <div className="publications-container">
      <h2 className="publications-title">Mis Especies</h2>
      {species.length === 0 ? (
        <p className="publications-empty">No has registrado especies aún.</p>
      ) : (
        <ul className="publications-list">
          {species.map(sp => (
            <li key={sp.id} className="publications-item">
              <h3>{sp.commonName}</h3>
              <p><strong>Nombre Científico:</strong> {sp.scientificName}</p>
              <p><strong>Categoría:</strong> {sp.category}</p>
              <p><strong>Estado de Conservación:</strong> {sp.conservationStatus}</p>
              <p><strong>Área Natural:</strong> {areas[sp.naturalAreaId] || "Área desconocida"}</p>
              <div className="publications-buttons">
                <button className="btn-edit" onClick={() => handleEdit(sp)}>
                  ✏ Modificar
                </button>
                <button className="btn-delete" onClick={() => handleDelete(sp.id)}>
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

export default MySpecies;
