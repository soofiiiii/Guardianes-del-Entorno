import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchActivityById, updateActivity } from "../../services/conservationActivityService";
import Navbar from "../../components/Navbar/Navbar";

const EditActivity = () => {
  const { user } = useContext(AuthContext);
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    console.log("ID recibido en EditActivity:", activityId);

    if (!activityId || isNaN(Number(activityId))) {
      setError("ID de actividad inválido.");
      setLoading(false);
      return;
    }

    const loadActivity = async () => {
      try {
        const activity = await fetchActivityById(Number(activityId), user.id);
        if (!activity) throw new Error("Actividad no encontrada.");

        setFormData({
          id: activity.id,
          naturalAreaId: activity.naturalAreaId,
          description: activity.description || "",  
          date: activity.date ? activity.date.split("T")[0] : "", 
        });
      } catch (err) {
        console.error("Error al cargar la actividad:", err);
        setError("No se pudo cargar la actividad.");
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [activityId, user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (!formData.id || !formData.naturalAreaId) {
        throw new Error("Faltan datos obligatorios: ID o Área Natural.");
      }

      const payload = {
        userId: user.id,
        conservationActivity: {
          id: Number(formData.id),
          userId: Number(user.id),
          naturalAreaId: Number(formData.naturalAreaId),
          description: formData.description,
          date: formData.date,
        },
      };

      console.log("Enviando payload de actualización:", JSON.stringify(payload, null, 2));

      await updateActivity(payload);
      setSuccessMessage("Actividad actualizada correctamente.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al actualizar la actividad:", error);
      setError("Error al actualizar la actividad.");
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando actividad...</p>;
  if (error) return <p className="alert alert-danger text-center">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Editar Actividad</h2>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Guardar Cambios
          </button>
        </form>
      </div>
    </>
  );
};

export default EditActivity;
