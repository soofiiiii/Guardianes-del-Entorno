import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams(); // Obtiene el ID del usuario desde la URL
  const [user, setUser] = useState(null);
  const [areas, setAreas] = useState([]);
  const [species, setSpecies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Obtener información del usuario
      
        const userResponse = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/user/${userId}?secret=TallerReact2025!`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        const userData = await userResponse.json();
        setUser(userData); 

        // Obtener áreas registradas por el usuario
        const areasResponse = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/areas?userId=${userId}&secret=TallerReact2025!`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        const areasData = await areasResponse.json();
        setAreas(areasData.items || []);

        // Obtener especies registradas por el usuario
        const speciesResponse = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/species?userId=${userId}&secret=TallerReact2025!`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData.items || []);

        // Obtener actividades registradas por el usuario
        const activitiesResponse = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/activities?userId=${userId}&secret=TallerReact2025!`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.items || []);

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        setError("No se pudo cargar la información del usuario.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="alert alert-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Perfil de {user?.name}
          </h2>
          <p className="text-muted text-center">{user?.email}</p>

          <h3 className="mt-4">Áreas Registradas</h3>
          {areas.length > 0 ? (
            <ul className="list-group">
              {areas.map((area) => (
                <li key={area.id} className="list-group-item">
                  {area.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay áreas registradas.</p>
          )}

          <h3 className="mt-4">Especies Registradas</h3>
          {species.length > 0 ? (
            <ul className="list-group">
              {species.map((specie) => (
                <li key={specie.id} className="list-group-item">
                  {specie.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay especies registradas.</p>
          )}

          <h3 className="mt-4">Actividades Registradas</h3>
          {activities.length > 0 ? (
            <ul className="list-group">
              {activities.map((activity) => (
                <li key={activity.id} className="list-group-item">
                  {activity.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay actividades registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
