import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createConservationActivity } from '../../services/conservationActivityService';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const CreateConservationActivity = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    naturalAreaId: '',
    description: '',
    date: ''
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
      setError('Debes iniciar sesión para registrar una actividad de conservación.');
      return;
    }
    if (!formData.naturalAreaId) {
      setError('Selecciona el área natural.');
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

    try {
      const data = await createConservationActivity(payload);
      if (data.result) {
        setSuccessMessage('Actividad de conservación creada correctamente.');
        // Opcional: redirigir a la lista de actividades o a otra sección
        // navigate('/mis-actividades');
      } else {
        setError('No se pudo crear la actividad.');
      }
    } catch (err) {
      console.error(err);
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
