import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createSpecies } from '../../services/speciesService';
import UserPublicationsSelect from '../../components/UserPublicationsSelect/UserPublicationsSelect';
import Navbar from "../../components/Navbar/Navbar";

const CreateSpecies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    category: '',
    conservationStatus: '',
    naturalAreaId: null 
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  //   Actualiza el naturalAreaId cuando el usuario selecciona una publicación
  const handleAreaSelect = (selectedId) => {
    console.log(" ID recibida en CreateSpecies:", selectedId);
    setFormData({ ...formData, naturalAreaId: selectedId ? Number(selectedId) : null });
  };
  
  

  //   Manejo de cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   Enviar el formulario
  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');
      setLoading(true);

      console.log(" Estado actual de formData antes de enviar:", formData);

      if (!formData.naturalAreaId || isNaN(formData.naturalAreaId)) {
          setError("Debes seleccionar un área natural válida.");
          console.error(" Error: naturalAreaId es inválido antes de enviar.", formData);
          setLoading(false);
          return;
      }

      const payload = {
          userId: user.id,
          species: {
              CommonName: formData.commonName,
              ScientificName: formData.scientificName,
              Category: formData.category,
              ConservationStatus: formData.conservationStatus,
              NaturalAreaId: Number(formData.naturalAreaId)
          }
      };

      console.log(" Enviando payload:", JSON.stringify(payload, null, 2));

      try {
          const response = await createSpecies(payload); 

          if (response && (response.Success || response.result)) {
              setSuccessMessage("Especie creada exitosamente.");
              navigate("/dashboard");
          } else {
              setError(response?.Message || "No se pudo crear la especie.");
          }
      } catch (err) {
          console.error(" Error en createSpecies:", err);
          setError("Error al conectar con el servidor.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <>
    < Navbar />
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

        {/*   Aquí usamos el nuevo componente para seleccionar un área natural */}
        <UserPublicationsSelect onSelect={handleAreaSelect} setFormData={setFormData} />


        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Especie'}
        </button>
      </form>
    </div>
    </>
  );
};

export default CreateSpecies;