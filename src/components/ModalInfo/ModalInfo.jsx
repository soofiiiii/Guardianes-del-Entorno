import React from 'react';
import './ModalInfo.css';

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
  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        
        <h2>{type === 'species' ? `Especie: ${data.commonName}` : 'Actividad de Conservación'}</h2>

        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.commonName || 'Imagen'} className="modal-image" />
        )}

        <div className="modal-info">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'id') return null; // Ocultamos la ID
            
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
