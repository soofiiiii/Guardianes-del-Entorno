import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createNaturalArea } from '../../services/naturalAreaService';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LocationSelect from '../../components/LocationSelect/LocationSelect';
import SpeciesForm from './SpeciesForm';
import './CreateNaturalArea.css'; 

const CreateNaturalArea = () => {
  const { user, addArea } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    areaType: '',
    region: '',
    conservationStatus: '',
    description: '',
    imageUrl: ''
  });

  // Estado para manejar la lista de formularios de especie
  const [speciesList, setSpeciesList] = useState([]);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Añadir un nuevo formulario de especie vacío
  const handleAddSpecies = () => {
    setSpeciesList((prev) => [...prev, {}]);
  };

  // Actualizar la información de una especie en la posición 'index'
  const handleSpeciesChange = (index, newSpeciesData) => {
    setSpeciesList((prev) =>
      prev.map((specie, i) => (i === index ? newSpeciesData : specie))
    );
  };

  // Eliminar un formulario de especie específico
  const handleRemoveSpecies = (index) => {
    setSpeciesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    console.log("Enviando formulario con especies:", speciesList);

    if (!user) {
      setError('Debes iniciar sesión para crear un área natural.');
      return;
    }

    setLoading(true);
    // Incluye la lista de especies en el payload (si speciesList tiene datos, se enviará)
    const payload = {
      userId: user.id,
      naturalArea: { ...formData, species: speciesList }
    };

    try {
      const data = await createNaturalArea(payload);
      if (data.result || data.Success) {
        setSuccessMessage(data.Message || 'Área natural creada correctamente.');
        // Guarda el área en el contexto (ajusta según lo que retorne la API)
        addArea({ ...data.area, ...formData, id: data.area?.id || data.id, species: speciesList });
        navigate('/dashboard');
      } else {
        setError(data.Message || 'No se pudo crear el área natural.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
      <Navbar />
    
    <div className="container mt-4">
      <h2>Crear Área Natural</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Campos del área */}
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ubicación</label>
          <LocationSelect 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Área</label>
          <input
            type="text"
            className="form-control"
            name="areaType"
            value={formData.areaType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Región</label>
          <input
            type="text"
            className="form-control"
            name="region"
            value={formData.region}
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
            <option value="Crítico">Crítico</option>
            <option value="En riesgo">En riesgo</option>
            <option value="Estable">Estable</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">URL de la Imagen</label>
          <input
            type="url"
            className="form-control"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
        
        {/* Sección de Especies */}
        <hr />
        <h3>Especies para esta Área</h3>
        <button type="button" className="btn btn-primary" onClick={handleAddSpecies}>
          Agregar Especie
        </button>
        {speciesList.map((specie, index) => (
          <SpeciesForm
            key={index}
            index={index}
            species={specie}
            onChange={handleSpeciesChange}
            onRemove={handleRemoveSpecies}
          />
        ))}
        
        <br></br>
        <button type="submit" className="btn btn-success mt-3" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Área Natural'}
        </button>
      </form>

      <Footer />
    </div>
    </>
  );
};

export default CreateNaturalArea;
