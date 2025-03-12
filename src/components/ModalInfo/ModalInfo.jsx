import React from 'react';
import './ModalInfo.css';

// Diccionario de traducciones para mostrar etiquetas en español
const traducciones = {
  commonName: 'Nombre Común',
  scientificName: 'Nombre Científico',
  category: 'Categoría',
  conservationStatus: 'Estado de Conservación',
  naturalAreaId: 'Área Natural',
  description: 'Descripción',
  date: 'Fecha',
  location: 'Ubicación',
  region: 'Región',
  areaType: 'Tipo de Área',
  imageUrl: 'Imagen',
};

const ModalInfo = ({ isOpen, onClose, data, type }) => {
  // Si el modal no está abierto o no hay datos, no se renderiza nada
  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        // Botón para cerrar el modal
        <button className="modal-close" onClick={onClose}>Χ</button>
        
        // Título del modal según el tipo de datos
        <h2>{type === 'species' ? `Especie: ${data.commonName}` : 'Actividad de Conservación'}</h2>

        // Muestra la imagen si está disponible
        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.commonName || 'Imagen'} className="modal-image" />
        )}

        <div className="modal-info">
          // Recorre las propiedades del objeto data y las muestra
          {Object.entries(data).map(([key, value]) => {
            // No muestra 'id', 'naturalAreaId' ni 'userId'
            if (key === 'id' || key === 'naturalAreaId' || key === 'userId') return null;
            
            // Obtiene la etiqueta traducida o formatea la clave
            const label = traducciones[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
            return (
              <p key={key}>
                <strong>{label}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModalInfo;
