import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchActivitiesByUser, deleteConservationActivity } from "../../services/conservationActivityService";
import "./Publications.css";

const MyActivities = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activitiesData = await fetchActivitiesByUser(user.id);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error al obtener actividades:", err);
        setError("No se pudieron cargar las actividades.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id !== 0) {
      loadActivities();
    }
  }, [user.id]);

  // Función para editar una actividad
  const handleEdit = (activity) => {
    navigate(`/edit-activity/${activity.id}`, { state: { activity } });
  };

  // Función para eliminar una actividad
  const handleDelete = async (activityId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta actividad?");
    if (!confirmDelete) return;
  
    try {
      await deleteConservationActivity({ userId: user.id, id: activityId }); // ✅ Cambiado `activityId` por `id`
      setActivities(activities.filter(activity => activity.id !== activityId));
      alert("Actividad eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      alert("No se pudo eliminar la actividad.");
    }
  };
  

  if (loading) return <p className="publications-empty">Cargando actividades...</p>;
  if (error) return <p className="publications-empty">{error}</p>;

  return (
    <div className="publications-container">
      <h2 className="publications-title">Mis Actividades</h2>
      {activities.length === 0 ? (
        <p className="publications-empty">No has registrado actividades aún.</p>
      ) : (
        <ul className="publications-list">
          {activities.map(activity => (
            <li key={activity.id} className="publications-item">
              <h3>{activity.name}</h3>
              <p><strong>Descripción:</strong> {activity.description}</p>
              <div className="publications-buttons">
                <button className="btn-edit" onClick={() => handleEdit(activity)}>
                  ✏ Modificar
                </button>
                <button className="btn-delete" onClick={() => handleDelete(activity.id)}>
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

export default MyActivities;
