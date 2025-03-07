import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createSpecies } from '../../services/speciesService';

const CreateSpecies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    category: '',
    conservationStatus: '',
    naturalAreaId: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!user) {
      setError('Debes iniciar sesión para crear una especie.');
      return;
    }

    setLoading(true);
    const payload = {
      userId: user.id, 
      species: {
        commonName: formData.commonName,
        scientificName: formData.scientificName,
        category: formData.category,
        conservationStatus: formData.conservationStatus,
        naturalAreaId: parseInt(formData.naturalAreaId) 
      }
    };

    try {
      const data = await createSpecies(payload);
      if (data.Success || data.result) {
        setSuccessMessage(data.Message || 'Especie insertada correctamente.');
      } else {
        setError(data.Message || 'No se pudo crear la especie.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Especie Avistada</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre Común</label>
          <input
            type="text"
            className="form-control"
            name="commonName"
            value={formData.commonName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre Científico</label>
          <input
            type="text"
            className="form-control"
            name="scientificName"
            value={formData.scientificName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado de Conservación</label>
          <select
            className="form-select"
            name="conservationStatus"
            value={formData.conservationStatus}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona</option>
            <option value="En peligro">En peligro</option>
            <option value="Vulnerable">Vulnerable</option>
            <option value="Estable">Estable</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">ID del Área Natural</label>
          <input
            type="number"
            className="form-control"
            name="naturalAreaId"
            value={formData.naturalAreaId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Especie'}
        </button>
      </form>
    </div>
  );
};

export default CreateSpecies;
