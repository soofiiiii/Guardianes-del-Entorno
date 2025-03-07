import React from 'react';
import './SpeciesForm.css';

const SpeciesForm = ({ index, species, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...species, [name]: value });
  };

  return (
    <div className="species-form-container">
      <div className="species-form-header">
        <span>Nueva Especie</span>
        <button type="button" className="remove-species-button" onClick={() => onRemove(index)}>
          &times;
        </button>
      </div>
      <div className="species-form-body">
        <div className="species-form-field">
          <label>Nombre Común:</label>
          <input
            type="text"
            name="commonName"
            value={species.commonName || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="species-form-field">
          <label>Nombre Científico:</label>
          <input
            type="text"
            name="scientificName"
            value={species.scientificName || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="species-form-field">
          <label>Categoría:</label>
          <input
            type="text"
            name="category"
            value={species.category || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="species-form-field">
          <label>Estado de Conservación:</label>
          <select
            name="conservationStatus"
            value={species.conservationStatus || ''}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona</option>
            <option value="En peligro">En peligro</option>
            <option value="Vulnerable">Vulnerable</option>
            <option value="Estable">Estable</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SpeciesForm;
