import React from 'react';

// Componente para mostrar una lista de actividades de conservación
const ActivitiesList = ({ activities, onSelect }) => {
  return (
    <>
      // Título de la sección
      <h2 className="section-title">Actividades de Conservación</h2>
      
      {activities.length > 0 ? (
        // Si hay actividades, se muestra cada una en una tarjeta
        <div className="card-container">
          {activities.map((activity) => (
            <div className="card" key={activity.id}>
              // Muestra la descripción de la actividad
              <h4>{activity.description}</h4>
              // Muestra la fecha de la actividad formateada localmente
              <p>
                <strong>Fecha:</strong> {new Date(activity.date).toLocaleDateString()}
              </p>
              // Botón para ver detalles de la actividad
              <button className="detail-button" onClick={() => onSelect(activity, 'activity')}>
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Mensaje si no hay actividades registradas
        <p>No se han registrado actividades de conservación en esta área.</p>
      )}
    </>
  );
};

export default ActivitiesList;
