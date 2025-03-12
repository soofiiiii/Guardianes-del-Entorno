import React from 'react';

// Componente que muestra una lista de especies avistadas
const SpeciesList = ({ species, onSelect }) => {
  return (
    <>
      // Título de la sección
      <h2 className="section-title">Especies Avistadas</h2>
      {species && species.length > 0 ? (
        // Contenedor de tarjetas para cada especie
        <div className="card-container">
          {species.map((specie) => (
            <div className="card" key={specie.id}>
              // Muestra el nombre común de la especie
              <h4>{specie.commonName}</h4>
              // Botón para ver detalles, usa onSelect si está definido
              <button 
                className="detail-button" 
                onClick={() => onSelect ? onSelect(specie, 'species') : console.warn("onSelect no está definido")}
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Mensaje en caso de que no existan especies
        <p>No se han registrado especies en esta área.</p>
      )}
    </>
  );
};

export default SpeciesList;
