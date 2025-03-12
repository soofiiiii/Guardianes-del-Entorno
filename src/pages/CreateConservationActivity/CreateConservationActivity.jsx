import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createConservationActivity } from '../../services/conservationActivityService';
import UserPublicationsSelect from '../../components/UserPublicationsSelect/UserPublicationsSelect'; //  Importar el selector
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const CreateConservationActivity = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    naturalAreaId: null,
    description: '',
    date: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  //  Función para actualizar el ID del área natural al seleccionarla
  const handleAreaSelect = (selectedId) => {
    console.log(" ID recibida en CreateConservationActivity:", selectedId);
    setFormData((prev) => ({ ...prev, naturalAreaId: selectedId ? Number(selectedId) : null }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    console.log("Usuario en contexto:", user);

    if (!user || !user.id) {
      setError('Debes iniciar sesión para registrar una actividad de conservación.');
      console.error("Error: `user.id` es indefinido o nulo.");
      return;
    }
    if (!formData.naturalAreaId || isNaN(formData.naturalAreaId)) {
      setError('Selecciona un área natural válida.');
      return;
    }

    setLoading(true);

    const payload = {
      conservationActivity: {
        userId: user.id,
        naturalAreaId: parseInt(formData.naturalAreaId),
        description: formData.description,
        date: formData.date
      }
    };

    console.log("Payload que se enviará:", JSON.stringify(payload, null, 2));

    try {
      const data = await createConservationActivity(payload);
      console.log("Respuesta del servidor:", data);

      if (data.result) {
        setSuccessMessage('Actividad de conservación creada correctamente.');
        navigate("/dashboard");
      } else {
        setError('No se pudo crear la actividad.');
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Nueva Actividad de Conservación</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          {/*  Selector dinámico para el área natural */}
          <div className="mb-3">
            <label className="form-label">Área Natural</label>
            <UserPublicationsSelect onSelect={handleAreaSelect} setFormData={setFormData} />
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
            <label className="form-label">Fecha (YYYY-MM-DD)</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Actividad'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateConservationActivity;
